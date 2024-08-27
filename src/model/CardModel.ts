import { TRank, TSuit } from "./DeckModel";

export class CardModel {
    private _rank: TRank;
    private _suit: TSuit;
    private _hidden = true;
    private _points = 0;

    constructor(rank: TRank, suit: TSuit) {
        this._rank = rank;
        this._suit = suit;
    }

    get rank() {
        return this._rank;
    }

    get suit() {
        return this._suit;
    }

    get value() {
        return `${this._rank}_of_${this._suit}`;
    }

    get hidden() {
        return this._hidden;
    }

    set hidden(isHidden: boolean) {
        this._hidden = isHidden;
    }
}