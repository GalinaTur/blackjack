import { Point } from "pixi.js";
import { Main } from "../../../main";
import { Button } from "./Button";
import { ChipView } from "./ChipView";
import { GameScene } from "../GameScene";
import { EChips, IPanel, TBets, } from "../../../data/types";
import { Panel } from "./Panel";
import { Animations } from "../../styles/Animations";
import { ColorGradientFilter } from "pixi-filters";
import { BUTTONS } from "../../../data/constants";

export class BetPanel extends Panel implements IPanel {
    private dealButton: Button;
    private doubleButton: Button;
    private undoButton: Button;
    private clearButton: Button;
    private isButtonsActive = false;
    private chips: ChipView[] = [];
    private availableBets: TBets[] = [];
    private lastChoosedChip: ChipView | null = null

    constructor(availableBets: TBets[]) {
        super('bet_panel');
        // if (betSize > 0) this.isButtonsActive = true;
        this.dealButton = new Button(BUTTONS.bet.deal, this.onPlaceBet, this.isButtonsActive);
        this.doubleButton = new Button(BUTTONS.bet.double, this.onPlaceBet, this.isButtonsActive);
        this.undoButton = new Button(BUTTONS.bet.undo, this.onPlaceBet, this.isButtonsActive);
        this.clearButton = new Button(BUTTONS.bet.clear, this.onClearBet, this.isButtonsActive);
        this.availableBets = availableBets;
    }

    protected async init(): Promise<void> {
        await super.init();
        this.setButtons();
        this.setChips();
    }

    private setButtons() {
        this.dealButton.position.set(Main.screenSize.width*0.5, -100);
        this.addChild(this.dealButton);

        this.doubleButton.position.set(Main.screenSize.width*0.55, -100);
        this.addChild(this.doubleButton);

        this.undoButton.position.set(Main.screenSize.width*0.6, -100);
        this.addChild(this.undoButton);

        this.clearButton.position.set(Main.screenSize.width*0.65, -100);
        this.addChild(this.clearButton);
    }

    private setChips() {
        for (let i = 0; i < this.availableBets.length; i++) {
            const key: string = this.availableBets[i] + '$';
            const name = EChips[key as keyof typeof EChips];
            const chip = new ChipView(name, this.availableBets[i], () => this.onChipClick(this.availableBets[i], chip));
            this.chips.push(chip);

            chip.scale.set(Math.max(Main.screenSize.width*3/10000, Main.screenSize.height*4/10000))
            chip.position.y = -100;
            chip.position.x = Main.screenSize.width*0.4 - i * Main.screenSize.width * 0.04;
            this.addChild(chip)
        }
    }

    private onClearBet() {
        Main.signalController.bet.cleared.emit();
    }

    private onPlaceBet() {
        Main.signalController.bet.placed.emit();
    }

    private async onChipClick(value: TBets, chip: ChipView) {
        const parent = this.parent as GameScene
        const key = `${value}$`;
        const newChip = new ChipView(EChips[key as keyof typeof EChips], value, () => { });
        newChip.position = newChip.toLocal(this.toGlobal(new Point(chip.x, chip.y)));
        this.lastChoosedChip = chip;
        await parent.addChipToStack(newChip);
        Main.signalController.bet.added.emit(value);
    }

    public async onBetUpdate(betSize: number, availableBets: TBets[]) {
        this.isButtonsActive = Boolean(betSize);
        this.availableBets = availableBets;
        await this.updateChips();
        this.clearButton.updateIsActive(this.isButtonsActive);
        this.dealButton.updateIsActive(this.isButtonsActive);
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


    public deactivate(): void {
        this.parent.removeChild(this);
    }
}