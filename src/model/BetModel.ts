export class BetModel {
    private _bets = [1, 5, 10, 25, 100, 500, 1000, 5000];
    private _betSize = 0;

    get bets() {
        return this._bets;
    }

    get betSize() {
        return this._betSize;
    }

    public increaseBet(value: number) {
        this._betSize += value;
    }

    public clearBet() {
        this._betSize = 0;
    }
}