import { RANKS, SUITS } from "../data/constants";
import { CardModel } from "./CardModel";

export class DeckModel {
    private _deck: CardModel[] = [];

    constructor() {
        this.init();
        this.shuffle();
    }

    private init(): void {
        for (let rank of RANKS) {
            for (let suit of SUITS) {
                this._deck.push(new CardModel(rank, suit));
            }
        }
    }

    private shuffle(): void {
        for (let i = this._deck.length - 1; i >= 0; i--) {
            const k = Math.floor(Math.random() * (1 + i));
            [this._deck[i], this._deck[k]] = [this._deck[k], this._deck[i]];
        }
        //for split feature (delete this);
        this._deck.push(new CardModel('king', 'spades'));
        this._deck.push(new CardModel('four', 'hearts'));
        this._deck.push(new CardModel('ace', 'clubs'));
        // this._deck.push(new CardModel('king', 'hearts'));
    }

    public getCard(): CardModel | null {
        const card = this._deck.pop();
        return card || null;
    }
}