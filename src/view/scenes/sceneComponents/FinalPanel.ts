import { Main } from "../../../main";
import { Button } from "./Button";
import { IPanel } from "../../../data/types";
import { Container } from "pixi.js";
import { BUTTONS } from "../../../data/constants";

export class FinalPanel extends Container implements IPanel {
    private repeatButton: Button;
    private topUpButton: Button;

    constructor() {
        super();
        this.repeatButton = new Button(BUTTONS.final.repeat, this.onRepeat, true);
        this.topUpButton = new Button(BUTTONS.final.topUp, this.onTopUp, true);
        this.init();
    }

    protected async init() {
        this.setButtons();
    }


    private setButtons() {
        this.repeatButton.position.set(Main.screenSize.width * 0.7, -100);
        this.topUpButton.position.set(Main.screenSize.width * 0.8, -100);

        this.addChild(this.repeatButton, this.topUpButton);
    }

    private onRepeat() {
        Main.signalController.round.new.emit();
    }

    private onTopUp() {
    }

    public onResize(): void {
        this.repeatButton.position.set(Main.screenSize.width * 0.7, -100);
        this.topUpButton.position.set(Main.screenSize.width * 0.8, -100);
    }

    public deactivate(): void {

    }
}