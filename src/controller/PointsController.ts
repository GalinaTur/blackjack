import { CardModel } from "../model/CardModel";

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

export class PointsController {
    calculate(cards: CardModel[]) {
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

    getAcePoints(sum: number){
        if (sum >= 11) {
            return 1;
        }
        return 11;
    }

    checkIfBlackJack(sum: number) {
        if (sum === 21) {
            console.log('BLACKJACK')
        }
    }
}