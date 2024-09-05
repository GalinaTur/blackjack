import { Container, Point } from "pixi.js";
import { Main } from "../../../main";
import { Button } from "./Button";
import { ChipView } from "./ChipView";
import { AVAILABLE_BETS } from "../../../data/constants";
import { GameScene } from "../GameScene";
import { EChips, IPanel, } from "../../../data/types";
import { Panel } from "./Panel";

export class BetPanel extends Panel implements IPanel {
    private clearBetButton: Button;
    private placeBetButton: Button;
    private isButtonsActive = false;
    private chips: ChipView[] = [];

    constructor(betSize: number) {
        super('bet_panel');
        if (betSize > 0) this.isButtonsActive = true;
        this.clearBetButton = new Button('Clear Bet', this.onClearBet, this.isButtonsActive);
        this.placeBetButton = new Button('Place Bet', this.onPlaceBet, this.isButtonsActive);

        this.init();
    }

    protected async init(): Promise<void> {
        await super.init();
        this.setButtons();
        this.setChips();
        
        this.setEventListeners();
    }

    private setEventListeners() {
        Main.signalController.bet.updated.add(this.onBetUpdate, this);
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
        for (let i = 0; i < AVAILABLE_BETS.length; i++) {
            const key: string = AVAILABLE_BETS[i] + '$';
            const name = EChips[key as keyof typeof EChips];
            const chip = new ChipView(name, AVAILABLE_BETS[i], () => this.onChipClick(AVAILABLE_BETS[i], chip));
            this.chips.push(chip);

            chip.position.y = -this.height * 0.7;
            chip.position.x = this.width * 0.322 + i * this.width * 0.14;
            if (chip.position.x > this.width * 0.8) {
                chip.position.y = -this.height * 0.28;
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

    private onChipClick(value: number, chip: Container) {
        const parent = this.parent as GameScene
        Main.signalController.bet.added.emit(value);
        const key = `${value}$`;
        const newChip = new ChipView(EChips[key as keyof typeof EChips], value, () => { });
        newChip.position = newChip.toLocal(this.toGlobal(new Point(chip.x, chip.y)));
        parent.addChipToStack(newChip);
    }

    public onBetUpdate(betSize: number) {
        this.isButtonsActive = Boolean(betSize);
        this.clearBetButton.update(this.isButtonsActive);
        this.placeBetButton.update(this.isButtonsActive);
    }


    public deactivate(): void {
        this.parent.removeChild(this);
    }
}