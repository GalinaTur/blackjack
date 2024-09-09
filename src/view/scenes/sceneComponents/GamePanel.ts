import { Main } from "../../../main";
import { Button } from "./Button";
import { ERoundState, IPanel } from "../../../data/types";
import { Panel } from "./Panel";

export class GamePanel extends Panel implements IPanel {
    private splitButton: Button;
    private doubleButton: Button;
    private hitButton: Button;
    private standButton: Button;

    constructor() {
        super('game_panel');
        this.splitButton = new Button('Split', this.onSplit, false);
        this.doubleButton = new Button('Double', this.onDouble, false);
        this.hitButton = new Button('Hit', this.onHit, false);
        this.standButton = new Button('Stand', this.onStand, false);
    }

    protected async init(): Promise<void> {
        await super.init();
        this.setButtons()
    }

    private setButtons() {
        this.splitButton.position.set(Main.screenSize.width * 0.4, -50);
        this.splitButton.scale.set(0.7);

        this.doubleButton.position.set(Main.screenSize.width * 0.55, -50);
        this.doubleButton.scale.set(0.7);

        this.standButton.position.set(Main.screenSize.width * 0.7, -50);
        this.standButton.scale.set(0.7);

        this.hitButton.position.set(Main.screenSize.width * 0.85, -50);
        this.hitButton.scale.set(0.7);

        this.addChild(this.splitButton, this.doubleButton, this.standButton, this.hitButton);
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

    public updateButtons(state: ERoundState) {
        const isActive = (state === ERoundState.PLAYERS_TURN) ? true : false;
        this.doubleButton.updateIsActive(isActive);
        this.hitButton.updateIsActive(isActive);
        this.standButton.updateIsActive(isActive);
    }
}