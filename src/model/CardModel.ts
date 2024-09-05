import { TRank, TSuit, TValue } from "../data/types";

export class CardModel {
    private _rank: TRank;
    private _suit: TSuit;
    private _hidden = true;

    constructor(rank: TRank, suit: TSuit) {
        this._rank = rank;
        this._suit = suit;
    }

    get rank(): TRank {
        return this._rank;
    }

    get suit(): TSuit {
        return this._suit;
    }

    get value(): TValue {
        return `${this._rank}_of_${this._suit}`;
    }

    get hidden(): boolean {
        return this._hidden;
    }

    set hidden(isHidden: boolean) {
        this._hidden = isHidden;
    }
}