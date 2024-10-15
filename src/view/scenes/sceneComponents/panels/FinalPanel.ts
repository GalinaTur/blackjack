import { Main } from "../../../../main";
import { IPanel } from "../../../../data/types";
import { Container } from "pixi.js";
import { BUTTONS } from "../../../../data/constants";
import { GameButton } from "../buttons/GameButton";

export class FinalPanel extends Container implements IPanel {
    private repeatButton: GameButton;
    // private topUpButton: GameButton;

    constructor() {
        super();
        this.repeatButton = new GameButton(BUTTONS.final.repeat, this.onRepeat, true);
        // this.topUpButton = new GameButton(BUTTONS.final.topUp, this.onTopUp, true);
        this.init();
    }

    protected init() {
        this.setButtons();
    }


    private setButtons() {
        this.repeatButton.position.set(Main.screenSize.width * 0.7, -100);
        // this.topUpButton.position.set(Main.screenSize.width * 0.8, -100);

        this.addChild(this.repeatButton);
    }

    private onRepeat() {
        Main.signalsController.round.new.emit();
    }

    private onTopUp() {
    }

    public onResize(): void {
        this.repeatButton.position.set(Main.screenSize.width * 0.6, -100);
        // this.topUpButton.position.set(Main.screenSize.width * 0.8, -100);
    }

    public deactivate(): void {
        this.repeatButton.deactivate();
        // this.topUpButton.deactivate();
        this.parent.removeChild(this);
    }
}