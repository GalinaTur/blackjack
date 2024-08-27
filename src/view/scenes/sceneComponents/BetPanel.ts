import { Container, Sprite } from "pixi.js";
import { AssetsLoader } from "../../../controller/AssetsController";
import { Main } from "../../../main";
import { Button } from "./Button";
import { Chip } from "./Chip";
import { DropShadowFilter } from "pixi-filters";

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

interface IChip {
    name: string,
    value: number
}

export class BetPanel extends Container {
    image: Sprite | null = null;
    clearBetButton: Button;
    placeBetButton: Button;
    dropShadowFilter: DropShadowFilter;
    chips: Chip[] = [];

    constructor(bets: number[]) {
        super();
        this.clearBetButton = new Button('Clear Bet', this.onClearBet);
        this.placeBetButton = new Button('Place Bet', this.onPlaceBet);
        this.dropShadowFilter = new DropShadowFilter({
            blur:5,
            quality: 3,
            alpha: 0.5,
            offset: {
                x: 0,
                y: -10,
            },
            color: 0x000000});

        this.setSprite()
        .then(this.setButtons.bind(this))
        .then(this.setChips.bind(this, bets));

        this.filters = [this.dropShadowFilter];
    }

    async setSprite() {
        this.image = await AssetsLoader.getSprite('bet_panel');
        this.image.anchor.y = 1
        this.resize();
        this.addChild(this.image);
    }

    setButtons() {
        this.clearBetButton.position.set(183, -155);
        this.clearBetButton.scale.set(0.7);
        this.addChild(this.clearBetButton);

        this.placeBetButton.position.set(this.width-183,-65);
        this.placeBetButton.scale.set(0.7);
        this.addChild(this.placeBetButton);
    }

    setChips(bets: number[]) {
        for (let i=0; i<bets.length; i++) {
            const key: string = bets[i] + '$';
            const name = EChips[key as keyof typeof EChips]
            const chip = new Chip(name, String(bets[i]), ()=>this.onChipClick(bets[i]))
            this.chips.push(chip)
            chip.position.y = -this.height*0.7;
            chip.position.x = this.width * 0.322 + i * this.width * 0.14;
            if (chip.position.x > this.width*0.8) {
                chip.position.y = -this.height*0.28;
                chip.position.x = -this.width * 0.31 + i * this.width * 0.14;
            }
            chip.scale.set(this.height*4/1000);
            this.addChild(chip)
        }
    }

    resize() {
        if (this.image === null) return;
        const bgRatio = this.image.height / this.image.width;

        this.image.width = Main.screenSize.width;
        this.image.height = this.image.width*bgRatio*0.65;
    }

    onResize() {
        this.resize();
    }

    onClearBet() {
        Main.signalController.bet.cleared.emit();
    }

    onPlaceBet() {
        Main.signalController.bet.placed.emit();
    }

    onChipClick(value: number) {
        Main.signalController.bet.added.emit(value);
    }
}