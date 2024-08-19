type TPipRank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10';
type TFaceRank = 'Jack' | 'Queen' | 'King';
type TAce = 'Ace';
export type TRank = TPipRank | TFaceRank | TAce;
export type TSuit = 'Hearts' | 'Diamonds' | 'Clubs' | 'Spades';

export class CardModel {
    private _rank: TRank;
    private _suit: TSuit;
    private _hidden = true;

    constructor(rank: TRank, suit: TSuit) {
        this._rank = rank;
        this._suit = suit;
    }

    // get points() {
    // }

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