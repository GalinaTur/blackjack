import { ERankPoints, ICardsDealed } from "../data/types";
import { CardModel } from "../model/CardModel";

export class PointsController {
    public calcPoints(cards: CardModel[]) {
        let aces: CardModel[] = [];
        let sum = cards.reduce((sum, card) => {
            if (card.hidden) {
                return sum;
            }
            if (card.rank === "ace") {
                aces.push(card);
                return sum;
            }
            return sum + ERankPoints[card.rank];
        }, 0)

        aces.forEach(() => {
            sum += this.getAcePoints(sum);
        })
        return sum;
    }

    private getAcePoints(sum: number) {
        return (sum >= 11) ? 1 : 11;
    }

    public getCardPoints(card: CardModel) {
        return ERankPoints[card.rank];
    }

    public isSplitAllowed(cards: CardModel[]) {
        if (cards.length !== 2) return false;
        return this.getCardPoints(cards[0]) === this.getCardPoints(cards[1]);
    }

    public isTie(cards: ICardsDealed) {
        return this.calcPoints(cards.dealer) === this.calcPoints(cards.player);
    }

    public isBust(cards: CardModel[]) {
        return this.calcPoints(cards) > 21;
    }

    public isWin(cards: CardModel[]) {
        return this.calcPoints(cards) === 21;
    }

    public comparePoints(cards: ICardsDealed) {

    }
}