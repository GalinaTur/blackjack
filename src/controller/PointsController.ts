import { ERankPoints } from "../data/types";
import { CardModel } from "../model/CardModel";

export class PointsController {
    public static calcPoints(cards: readonly CardModel[]) {
        let acesCount: number = 0;
        let sum = cards.reduce((sum, card) => {
            if (card.hidden) {
                return sum;
            }
            if (card.rank === "ace") {
                acesCount++;
                return sum;
            }
            return sum + ERankPoints[card.rank];
        }, 0)

        for (let i = 1; i <= acesCount; i++) {
            const isLast = i === acesCount
            sum += this.getAcePoints(sum, isLast);
        }
        return sum;
    }

    private static getAcePoints(sum: number, isLast: boolean): number {
        const points = (sum < 11 && isLast) ? 11 : 1;
        return points;
    }

    public static getCardPoints(card: CardModel) {
        return ERankPoints[card.rank];
    }

    public static isSplitAllowed(cards: readonly CardModel[]) {
        if (cards.length !== 2) {
            return false;
        }
        return this.getCardPoints(cards[0]) === this.getCardPoints(cards[1]);
    }

    public static isTie(dealerCards: readonly CardModel[], playerCards: readonly CardModel[]) {
        return this.calcPoints(dealerCards) === this.calcPoints(playerCards);
    }

    public static isBust(cards: readonly CardModel[]) {
        return this.calcPoints(cards) > 21;
    }

    public static is21Points(cards: readonly CardModel[]) {
        return this.calcPoints(cards) === 21;
    }

    public static comparePoints(dealerCards: readonly CardModel[], playerCards: readonly CardModel[]) {
        return this.isTie(dealerCards, playerCards) ? 'push' :
            this.calcPoints(playerCards) > this.calcPoints(dealerCards) ? 'win' : 'lose';
    }
}