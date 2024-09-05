import { Main } from "../../../main";
import { Button } from "./Button";
import { IPanel } from "../../../data/types";
import { Panel } from "./Panel";

export class GamePanel extends Panel implements IPanel {
    private splitButton: Button;
    private doubleButton: Button;
    private hitButton: Button;
    private standButton: Button;

    constructor() {
        super('game_panel');
        this.splitButton = new Button('Split', this.onSplit, true);
        this.doubleButton = new Button('Double', this.onDouble, true);
        this.hitButton = new Button('Hit', this.onHit, true);
        this.standButton = new Button('Stand', this.onStand, true);

        this.init();
    }

    protected async init(): Promise<void> {
        await super.init();
        this.setButtons()
    }

    private setButtons() {
        this.splitButton.position.set(120, -50);
        this.splitButton.scale.set(0.7);
        this.buttonContainer.addChild(this.splitButton);

        this.doubleButton.position.set(340, -50);
        this.doubleButton.scale.set(0.7);
        this.buttonContainer.addChild(this.doubleButton);

        this.hitButton.position.set(560, -50);
        this.hitButton.scale.set(0.7);
        this.buttonContainer.addChild(this.hitButton);

        this.standButton.position.set(780, -50);
        this.standButton.scale.set(0.7);
        this.buttonContainer.addChild(this.standButton);

        this.addChild(this.buttonContainer);
    }

    private onHit() {
        Main.signalController.player.hit.emit();
    }

    private onStand() {
        Main.signalController.player.stand.emit();
    }

    private onDouble() {
        Main.signalController.player.double.emit();
    }

    private onSplit() {
        Main.signalController.player.split.emit();
    }
}