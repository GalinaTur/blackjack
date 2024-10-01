import { PlayerModel } from "../model/PlayerModel";
import { ParticipantController } from "./ParticipantController";
import { RoundController } from "./RoundController";

export class PlayerController extends ParticipantController<PlayerModel> {

    constructor(roundController: RoundController,  hand: PlayerModel) {
        super(roundController, hand)
        this.setEventListeners();
    }

    private setEventListeners() {
        this.signalsController.player.hit.add(this.onHit, this);
        this.signalsController.player.stand.add(this.onStand, this);
        this.signalsController.player.double.add(this.onDoubleDown, this);
        this.signalsController.player.split.add(this.onSplit, this);
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
        this.roundController.endTurn()
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
        this._hand = hand;
    }

    get hand() {
        return this._hand;
    }

    private async onSplit() {
        await this.roundController.onPlayerSplit();
        this.roundController.handleNextAction();
    }

    public deactivate() {
        this.signalsController.player.hit.remove(this.onHit);
        this.signalsController.player.stand.remove(this.onStand);
        this.signalsController.player.double.remove(this.onDoubleDown);
        this.signalsController.player.split.remove(this.onSplit);
    }
}