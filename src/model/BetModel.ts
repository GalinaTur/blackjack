import { TBets } from "../data/types";

export class BetModel {
    private _availableBets: TBets[] = [];
    private _choosedBetValues: TBets[] = [];

    public addToBet(value: TBets) {
        this._choosedBetValues.push(value);
    }

    public clearBet() {
        this._choosedBetValues = [];
    }

    get betValues() {
        return this._choosedBetValues;
    }

    get betSum() {
        return this._choosedBetValues.reduce((sum, bet) => sum + bet, 0);
    }
    
    set availableBets(availableBets: TBets[]) {
        this._availableBets = availableBets;
    }

    get availableBets() {
        return this._availableBets;
    }
}

