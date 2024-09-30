import { Main } from "../main";
import { CardModel } from "../model/CardModel";
import { ParticipantModel } from "../model/ParticipantModel";
import { PointsController } from "./PointsController";
import { RoundController } from "./RoundController";

export class ParticipantController<T extends ParticipantModel> {
    protected roundController: RoundController;
    protected _hand: T;
    protected pointsController: PointsController;

    constructor(roundController: RoundController, pointsController: PointsController, hand: T) {
        this.roundController = roundController;
        this.pointsController = pointsController;
        this._hand = hand;
    }

    protected async onHit() {
        await this.dealCard();
        this.roundController.handleNextAction();
    }

    public dealCard() {
        return new Promise<void>(resolve => {
            this._hand.drawCard();
            const totalPoints = this.pointsFrom(this._hand.cards);
            const person = this._hand.name;
            const card = this._hand.cards[this._hand.cards.length - 1];
            Main.signalController.card.deal.emit({ person, card, totalPoints, resolve });
        })
    }

    protected onStand() {
        this.roundController.endTurn();
    }

    protected pointsFrom(cards: readonly CardModel[]): number {
        return this.pointsController.calcPoints(cards);
    }
}