import { Main } from "../main";
import { PlayerModel } from "../model/PlayerModel";
import { ParticipantController } from "./ParticipantController";
import { PointsController } from "./PointsController";
import { RoundController } from "./RoundController";

export class PlayerController extends ParticipantController<PlayerModel> {

    constructor(roundController: RoundController, pointsController: PointsController, hand: PlayerModel) {
        super(roundController, pointsController, hand)
        this.setEventListeners();
    }

    private setEventListeners() {
        Main.signalController.player.hit.add(this.onHit, this);
        Main.signalController.player.stand.add(this.onStand, this);
        Main.signalController.player.double.add(this.onDoubleDown, this);
        Main.signalController.player.split.add(this.onSplit, this);
    }

    public checkForBJ() {
        return this.pointsFrom(this.hand.cards) === 21;
    }

    public async handleTurn() {
        if (this.hand.cards.length < 2) await this.dealCard();
        if (this.pointsController.is21Points(this.hand.cards)) {
            this.onStand();
            return;
        }
        if (this.pointsController.isBust(this.hand.cards)) this.onBust();
    }

    private onBust() {
        this.roundController.roundModel.setResult('playerBust', this.hand.name);
        this.roundController.endTurn();
    }

    private async onDoubleDown() {
        if (!this.hand.cards.length) return;
        await this.dealCard();
        if (this.pointsController.isBust(this.hand.cards)) {
            this.onBust();
            return;
        }
        this.roundController.goToNextState();
    }

    public setHand(hand: PlayerModel) {
        this.hand = hand;
    }

    private async onSplit() {
        await this.roundController.onPlayerSplit();
        this.roundController.handleNextAction();
    }

    public deactivate() {
        Main.signalController.player.hit.remove(this.onHit);
        Main.signalController.player.stand.remove(this.onStand);
        Main.signalController.player.double.remove(this.onDoubleDown);
        Main.signalController.player.split.remove(this.onSplit);
    }
}