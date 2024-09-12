import { Main } from "../../../main";
import { Button } from "./Button";
import { IPanel } from "../../../data/types";
import { Panel } from "./Panel";

export class FinalPanel extends Panel implements IPanel {
    // private rebetButton: Button;
    // private newHandButton: Button;

    constructor() {
        super('game_panel');
        // this.rebetButton = new Button('Rebet', this.onRebet, true);
        // this.newHandButton = new Button('New Hand', this.onNewHand, true);
    }

    protected async init() {
        await super.init();
        this.setButtons();
    }

    private setButtons() {
        // this.rebetButton.position.set(Main.screenSize.width*0.85, -50);
        // this.rebetButton.scale.set(0.7);
        // this.addChild(this.rebetButton);

        // this.newHandButton.position.set(Main.screenSize.width*0.7, -50);
        // this.newHandButton.scale.set(0.7);
        // this.addChild(this.newHandButton);
    }

    private onRebet() {
        Main.signalController.round.new.emit();
    }

    private onNewHand() {
    }

    public deactivate(): void {

    }
}