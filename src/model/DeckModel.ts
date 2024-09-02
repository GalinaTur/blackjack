import { CardModel } from "./CardModel";

const ranks = ['two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'jack', 'queen', 'king', 'ace'] as const;
const suits = ['hearts', 'diamonds', 'clubs', 'spades'] as const;

export type TRank = typeof ranks[number];
export type TSuit = typeof suits[number];

export class DeckModel {
    private _deck: CardModel[] = [];

    constructor() {
        this.init();
        this.shuffle();
    }

    private init(): void {
        for (let rank of ranks) {
            for (let suit of suits) {
                this._deck.push(new CardModel(rank, suit));
            }
        }
    }

    private shuffle(): void {
        for(let i=this._deck.length-1; i>=0; i--) {
            const k = Math.round(Math.random() * (1+i));
            [this._deck[i], this._deck[k]] = [this._deck[k], this._deck[i]];
        }
    }

    public getCard(): CardModel | null {
        const card = this._deck.pop();
        return card || null;
    }
}