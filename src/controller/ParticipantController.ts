import { Main } from "../main";
import { CardModel } from "../model/CardModel";
import { ParticipantModel } from "../model/ParticipantModel";
import { PointsController } from "./PointsController";
import { RoundController } from "./RoundController";

export class ParticipantController<T extends ParticipantModel> {
    protected roundController: RoundController;
    protected hand: T;
    protected pointsController: PointsController;

    constructor(roundController: RoundController, pointsController: PointsController, hand: T) {
        this.roundController = roundController;
        this.pointsController = pointsController;
        this.hand = hand;
    }

    protected async onHit() {
        await this.dealCard();
        this.roundController.handleNextAction();
    }

    public async dealCard() {
        return new Promise<void>(async (resolve) => {
            await this.hand.drawCard();
            const totalPoints = this.pointsFrom(this.hand.cards);
            const person = this.hand.name;
            const card = this.hand.cards[this.hand.cards.length - 1];
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