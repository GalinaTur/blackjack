import { Point } from "pixi.js";
import { Main } from "../../../main";
import { Button } from "./Button";
import { ChipView } from "./ChipView";
import { GameScene } from "../GameScene";
import { EChips, IPanel, TBets, } from "../../../data/types";
import { Panel } from "./Panel";
import { Animations } from "../../styles/Animations";

export class BetPanel extends Panel implements IPanel {
    private clearBetButton: Button;
    private placeBetButton: Button;
    private isButtonsActive = false;
    private chips: ChipView[] = [];
    private availableBets: TBets[] = [];
    private lastChoosedChip: ChipView | null = null

    constructor(availableBets: TBets[]) {
        super('bet_panel');
        // if (betSize > 0) this.isButtonsActive = true;
        this.clearBetButton = new Button('Clear Bet', this.onClearBet, this.isButtonsActive);
        this.placeBetButton = new Button('Place Bet', this.onPlaceBet, this.isButtonsActive);
        this.availableBets = availableBets;
    }

    protected async init(): Promise<void> {
        await super.init();
        this.setButtons();
        this.setChips();
    }

    private setButtons() {
        this.clearBetButton.position.set(183, -155);
        this.clearBetButton.scale.set(0.7);
        this.addChild(this.clearBetButton);

        this.placeBetButton.position.set(this.width - 183, -65);
        this.placeBetButton.scale.set(0.7);
        this.addChild(this.placeBetButton);
    }

    private setChips() {
        for (let i = 0; i < this.availableBets.length; i++) {
            const key: string = this.availableBets[i] + '$';
            const name = EChips[key as keyof typeof EChips];
            const chip = new ChipView(name, this.availableBets[i], () => this.onChipClick(this.availableBets[i], chip));
            this.chips.push(chip);

            chip.position.y = -Main.screenSize.height * 0.2;
            chip.position.x = this.width * 0.322 + i * this.width * 0.14;
            if (chip.position.x > this.width * 0.8) {
                chip.position.y = -Main.screenSize.height * 0.08;
                chip.position.x = -this.width * 0.31 + i * this.width * 0.14;
            }
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
        this.clearBetButton.updateIsActive(this.isButtonsActive);
        this.placeBetButton.updateIsActive(this.isButtonsActive);
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