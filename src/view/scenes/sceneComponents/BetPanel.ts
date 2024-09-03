import { Container, Sprite } from "pixi.js";
import { Main } from "../../../main";
import { Button } from "./Button";
import { Chip } from "./ChipView";
import { DropShadowFilter } from "pixi-filters";
import { Effects } from "../../styles/Effects";
import { AVAILABLE_BETS } from "../../../data/constants";
import { IPanel } from "../../GameView";

enum EChips {
    '1$' = 'chipWhite',
    '5$' = 'chipRed',
    '10$' = 'chipOrange',
    '25$' = 'chipGreen',
    '100$' = 'chipBlack',
    '500$' = 'chipPurple',
    '1000$' = 'chipYellow',
    '5000$' = 'chipBlue',
}

export class BetPanel extends Container implements IPanel{
    private background: Sprite | null = null;
    private clearBetButton: Button;
    private placeBetButton: Button;
    private dropShadowFilter = new DropShadowFilter(Effects.FOOTER_PANEL_DROP_SHADOW);
    private isButtonsActive = false;
    private chips: Chip[] = [];

    constructor(betSize: number) {
        super();
        if (betSize > 0) this.isButtonsActive = true;
        this.clearBetButton = new Button('Clear Bet', this.onClearBet, this.isButtonsActive);
        this.placeBetButton = new Button('Place Bet', this.onPlaceBet, this.isButtonsActive);

        Main.signalController.bet.updated.add(this.onBetUpdate, this);

        this.setBackground()
            .then(this.setButtons.bind(this))
            .then(this.setChips.bind(this));

        this.filters = [this.dropShadowFilter];
    }

    private async setBackground() {
        this.background = await Main.assetsLoader.getSprite('bet_panel');
        this.background.anchor.y = 1
        this.resize();
        this.addChild(this.background);
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
            const chip = new Chip(name, String(AVAILABLE_BETS[i]), () => this.onChipClick(AVAILABLE_BETS[i]));
            this.chips.push(chip);

            chip.position.y = -this.height * 0.7;
            chip.position.x = this.width * 0.322 + i * this.width * 0.14;
            if (chip.position.x > this.width * 0.8) {
                chip.position.y = -this.height * 0.28;
                chip.position.x = -this.width * 0.31 + i * this.width * 0.14;
            }

            chip.scale.set(this.height * 4 / 1000);
            this.addChild(chip)
        }
    }

    private resize() {
        if (this.background === null) return;
        const bgRatio = this.background.height / this.background.width;

        this.background.width = Main.screenSize.width;
        this.background.height = this.background.width * bgRatio * 0.65;
    }

    private onResize() {
        this.resize();
    }

    private onClearBet() {
        Main.signalController.bet.cleared.emit();
    }

    private onPlaceBet() {
        Main.signalController.bet.placed.emit();
    }

    private onChipClick(value: number) {
        Main.signalController.bet.added.emit(value);
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