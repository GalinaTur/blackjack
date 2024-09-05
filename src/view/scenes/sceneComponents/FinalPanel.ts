import { Main } from "../../../main";
import { Button } from "./Button";
import { IPanel } from "../../../data/types";
import { Panel } from "./Panel";

export class FinalPanel extends Panel implements IPanel {
    private rebetButton: Button;
    private newHandButton: Button;

    constructor() {
        super('game_panel');
        this.rebetButton = new Button('Rebet', this.onRebet, true);
        this.newHandButton = new Button('New Hand', this.onNewHand, true);

        this.init();
    }

    protected async init() {
        await super.init();
        this.setButtons();
    }

    private setButtons() {
        this.rebetButton.position.set(180, -50);
        this.rebetButton.scale.set(0.7);
        this.addChild(this.rebetButton);

        this.newHandButton.position.set(400, -50);
        this.newHandButton.scale.set(0.7);
        this.addChild(this.newHandButton);
    }

    private onRebet() {
        console.log('rebet')
        Main.signalController.round.new.emit();
    }

    private onNewHand() {
    }

    public deactivate(): void {

    }
}