import { Main } from "../main";
import { CardModel } from "../model/CardModel";
import { ParticipantModel } from "../model/ParticipantModel";
import { PointsController } from "./PointsController";
import { RoundController } from "./RoundController";

export class ParticipantController<T extends ParticipantModel> {
    protected signalsController = Main.signalsController;
    protected pointsController = PointsController;

    constructor(
        protected roundController: RoundController,
        protected _hand: T) {
    }

    protected async onHit(): Promise<void> {
        await this.dealCard();
        this.roundController.handleNextAction();
    }

    protected onStand(): void {
        this.roundController.endTurn();
    }

    protected pointsFrom(cards: readonly CardModel[]): number {
        return this.pointsController.calcPoints(cards);
    }

    public dealCard(): Promise<void> {
        return new Promise<void>(resolve => {
            this._hand.drawCard();
            const totalPoints = this.pointsFrom(this._hand.cards);
            const person = this._hand.name;
            const card = this._hand.cards[this._hand.cards.length - 1];
            this.signalsController.card.deal.emit({ person, card, totalPoints, resolve });
        })
    }
}