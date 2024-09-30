import { Main } from "../../../../main";
import { ERoundState, IPanel } from "../../../../data/types";
import { BUTTONS, SOUNDS } from "../../../../data/constants";
import { Container } from "pixi.js";
import { CardModel } from "../../../../model/CardModel";
import { GameButton } from "../buttons/GameButton";

export class GamePanel extends Container implements IPanel {
    private splitButton: GameButton;
    private doubleButton: GameButton;
    private hitButton: GameButton;
    private standButton: GameButton;
    private isDoubleAllowed: boolean;

    constructor(isDoubleAllowed: boolean) {
        super();
        this.splitButton = new GameButton(BUTTONS.game.split, this.onSplit.bind(this), false);
        this.doubleButton = new GameButton(BUTTONS.game.doubleDown, this.onDouble.bind(this), false);
        this.hitButton = new GameButton(BUTTONS.game.hit, this.onHit.bind(this), false);
        this.standButton = new GameButton(BUTTONS.game.stand, this.onStand.bind(this), false);
        this.isDoubleAllowed = isDoubleAllowed
        this.init();
    }

    protected async init(): Promise<void> {
        this.setButtons()
    }

    private setButtons() {
        this.splitButton.position.set(Main.screenSize.width * 0.9, -100);

        this.doubleButton.position.set(Main.screenSize.width * 0.8, -100);

        this.standButton.position.set(Main.screenSize.width * 0.7, -100);

        this.hitButton.position.set(Main.screenSize.width * 0.6, -100);

        this.addChild(this.splitButton, this.doubleButton, this.standButton, this.hitButton);
    }

    private async playSound(soundID: string) {
        const sound = await Main.assetsController.getSound(soundID);
        sound.play();
    }

    private onHit() {
        this.playSound(SOUNDS.hit);
        Main.signalController.player.hit.emit();
        this.disableButtons();
    }

    private onStand() {
        this.playSound(SOUNDS.stand);
        this.disableButtons();
        Main.signalController.player.stand.emit();
    }

    private onDouble() {
        this.playSound(SOUNDS.doubledown);
        this.disableButtons();
        Main.signalController.player.double.emit();
    }

    private onSplit() {
        this.playSound(SOUNDS.split);
        Main.signalController.player.split.emit();
        this.disableButtons();
    }

    public updateButtons(state: ERoundState, cards: readonly CardModel[], isDoubleAllowed: boolean, isSplitAllowed?: boolean) {
        this.isDoubleAllowed = isDoubleAllowed;
        this.updateHitStandButtons(state);
        if (isSplitAllowed) this.splitButton.updateIsActive(isSplitAllowed && this.isDoubleAllowed);
        if (this.isDoubleAllowed) {
            this.updateDoubleButton(cards);
        }
    }

    private updateHitStandButtons(state: ERoundState) {
        const isActive = (state === ERoundState.PLAYERS_TURN || state === ERoundState.SPLIT_TURN) ? true : false;
        this.hitButton.updateIsActive(isActive);
        this.standButton.updateIsActive(isActive);
    }

    public updateDoubleButton(cards: readonly CardModel[]) {
        const isActive = cards.length <= 2;
        this.doubleButton.updateIsActive(isActive);
    }

    private disableButtons() {
        this.hitButton.updateIsActive(false);
        this.standButton.updateIsActive(false);
        this.doubleButton.updateIsActive(false);
        this.splitButton.updateIsActive(false);
    }

    public deactivate(): void {
        this.parent.removeChild(this);
    }

    public onResize() {
        this.splitButton.position.set(Main.screenSize.width * 0.9, -100);

        this.doubleButton.position.set(Main.screenSize.width * 0.8, -100);

        this.standButton.position.set(Main.screenSize.width * 0.7, -100);

        this.hitButton.position.set(Main.screenSize.width * 0.6, -100);
    }
}