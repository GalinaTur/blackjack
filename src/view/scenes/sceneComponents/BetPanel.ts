import { Container, Point } from "pixi.js";
import { Main } from "../../../main";
import { Button } from "./Button";
import { ChipView } from "./ChipView";
import { GameScene } from "../GameScene";
import { EChips, IPanel, TBets, } from "../../../data/types";
import { Animations } from "../../styles/Animations";
import { BUTTONS } from "../../../data/constants";

export class BetPanel extends Container implements IPanel {
    private dealButton: Button | null = null;
    private doubleButton: Button | null = null;
    private undoButton: Button | null = null;
    private clearButton: Button | null = null;
    private isButtonsActive = false;
    private chips: ChipView[] = [];
    private availableBets: TBets[] = [];
    private lastChoosedChip: ChipView | null = null

    constructor(availableBets: TBets[]) {
        super();
        // if (betSize > 0) this.isButtonsActive = true;
        this.availableBets = availableBets;
        this.init();
    }

    private async init(): Promise<void> {
        await this.setButtons();
        await this.setChips();
    }

    private async setButtons() {
        this.dealButton = new Button(BUTTONS.bet.deal, this.onPlaceBet, this.isButtonsActive);
        this.doubleButton = new Button(BUTTONS.bet.double, this.onDoubleBet, this.isButtonsActive);
        this.undoButton = new Button(BUTTONS.bet.undo, this.onUndoBet, this.isButtonsActive);
        this.clearButton = new Button(BUTTONS.bet.clear, this.onClearBet, this.isButtonsActive);

        this.dealButton.position.set(Main.screenSize.width * 0.6, -100);
        this.doubleButton.position.set(Main.screenSize.width * 0.7, -100);
        this.undoButton.position.set(Main.screenSize.width * 0.8, -100);
        this.clearButton.position.set(Main.screenSize.width * 0.9, -100);

        this.addChild(this.dealButton, this.doubleButton, this.undoButton, this.clearButton);
    }

    private async setChips() {
        for (let i = 0; i < this.availableBets.length; i++) {
            
            const chip = new ChipView(this.availableBets[i], () => this.onChipClick(this.availableBets[i], chip));
            this.chips.push(chip);
            chip.position.y = -100;
            chip.position.x = Main.screenSize.width * 0.4 - i * Main.screenSize.width * 0.07;
            this.addChild(chip)
        }
    }

    private onClearBet() {
        Main.signalController.bet.cleared.emit();
    }

    private onPlaceBet() {
        Main.signalController.bet.placed.emit();
    }

    private onDoubleBet() {
        Main.signalController.bet.doubled.emit();
    }

    
    private onUndoBet() {
        Main.signalController.bet.removedLast.emit();
    }

    private async onChipClick(value: TBets, chip: ChipView) {
        const parent = this.parent as GameScene
        const newChip = new ChipView(value, () => { });
        newChip.position = newChip.toLocal(this.toGlobal(new Point(chip.x, chip.y)));
        newChip.scale.set(chip.scale.x, chip.scale.y);
        this.lastChoosedChip = chip;
        await parent.addChipToStack(newChip);
        Main.signalController.bet.added.emit(value);
    }

    public async onBetUpdate(betSize: number, availableBets: TBets[], isDoubleAllowed: boolean) {
        this.isButtonsActive = Boolean(betSize);
        this.availableBets = availableBets;
        await this.updateChips();
        this.clearButton && this.clearButton.updateIsActive(this.isButtonsActive);
        this.doubleButton && this.doubleButton.updateIsActive(isDoubleAllowed && this.isButtonsActive);
        this.undoButton && this.undoButton.updateIsActive(this.isButtonsActive);
        this.dealButton && this.dealButton.updateIsActive(this.isButtonsActive);
    }

    private async updateChips() {
        this.chips.forEach(async (chip) => {
            if (this.availableBets.includes(chip.value)) {
                chip.hidden && this.makeAvailable(chip);
                return;
            }
            await this.hide(chip);
        })
    }

    private async makeAvailable(chip: ChipView) {
        chip.hidden = false;
        await Animations.chip.show(chip);
        chip.eventMode = 'static';
    }

    private async hide(chip: ChipView) {
        if (chip.hidden) return;

        chip.eventMode = 'none';
        chip.hidden = true;

        if (chip === this.lastChoosedChip) {
            chip.position.y += 200;
            return;
        }
        await Animations.chip.hide(chip);
    }

    public onResize() {

        this.chips.forEach((chip, index) => {
            chip.position.x = Main.screenSize.width * 0.4 - index * Main.screenSize.width * 0.07;
            this.addChild(chip)
        });

        this.dealButton?.position.set(Main.screenSize.width * 0.6, -100);
        this.doubleButton?.position.set(Main.screenSize.width * 0.7, -100);
        this.undoButton?.position.set(Main.screenSize.width * 0.8, -100);
        this.clearButton?.position.set(Main.screenSize.width * 0.9, -100);
    }

    public deactivate(): void {
        this.parent.removeChild(this);
    }
}