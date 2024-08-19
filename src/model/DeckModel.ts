import { CardModel, TRank, TSuit } from "./CardModel";

export class DeckModel {
    private _deck: CardModel[] = [];

    constructor() {
        const ranks: TRank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
        const suits: TSuit[] = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];

        for (let rank of ranks) {
            for (let suit of suits) {
                this._deck.push(new CardModel(rank, suit));
            }
        }
    }

    shuffle() {
        for(let i=this._deck.length-1; i>=0; i--) {
            const k = Math.round(Math.random() * (1+i));
            [this._deck[i], this._deck[k]] = [this._deck[k], this._deck[i]];
        }
    }
}