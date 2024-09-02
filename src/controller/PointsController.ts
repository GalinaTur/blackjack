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
        
        aces.forEach(()=> {
            sum += this.getAcePoints(sum);
        })

        return sum;
    }

    private getAcePoints(sum: number){
        return (sum >= 11) ? 1: 11;
    }

    public getCardPoints(card: CardModel) {
        return ERankPoints[card.rank];
    }
}

enum ERankPoints {
    'two' = 2,
    'three' = 3,
    'four' = 4,
    'five' = 5,
    'six' = 6,
    'seven' = 7,
    'eight' = 8,
    'nine' = 9,
    'ten' = 10,
    'jack' = 10,
    'queen' = 10,
    'king' = 10,
    'ace' = 1 | 11,
}