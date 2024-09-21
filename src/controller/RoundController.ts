import { DeckModel } from "../model/DeckModel";
import { RoundModel } from "../model/RoundModel";
import { GameView } from "../view/GameView";
import { Main } from "../main";
import { BettingController } from "./BettingController";
import { PointsController } from "./PointsController";
import { ERoundState, TParticipants, TResult } from "../data/types";
import { CardModel } from "../model/CardModel";

export class RoundController {
    public roundModel: RoundModel;
    private gameView: GameView;
    private deck = new DeckModel();
    private pointsController = new PointsController();
    private bettingController

    constructor(roundModel: RoundModel, gameView: GameView, bettingController: BettingController) {
        this.gameView = gameView;
        this.roundModel = roundModel;
        this.bettingController = bettingController;
        this.init();
    }

    private async init() {
        this.setEventListeners();
        this.handleNextAction(this.roundModel.state);
    }

    private setEventListeners() {
        Main.signalController.round.start.add(this.onRoundStart, this);
        Main.signalController.bet.placed.add(this.onBetPlaced, this);
        Main.signalController.player.hit.add(this.onPlayerHit, this);
        Main.signalController.player.stand.add(this.onPlayerStand, this);
        Main.signalController.player.double.add(this.onPlayerDoubleDown, this);
        Main.signalController.player.split.add(this.onPlayerSplit, this);
    }

    private async handleNextAction(state: ERoundState) {
        let dealTo: TParticipants = 'player';
        switch (state) {
            case ERoundState.NOT_STARTED:
                this.gameView.render(this.roundModel.roundStateInfo)
                break;
            case ERoundState.BETTING:
                this.gameView.render(this.roundModel.roundStateInfo)
                break;

            case ERoundState.CARDS_DEALING:
                this.gameView.render(this.roundModel.roundStateInfo)
                while (!this.roundModel.isDealingEnded()) {
                    await this.dealCardTo(dealTo)
                    dealTo = dealTo === 'player' ? 'dealer' : 'player';
                }
                if (! await this.checkForBJ()) this.changeState(ERoundState.PLAYERS_TURN);
                break;

            case ERoundState.PLAYERS_TURN:
                if (this.pointsController.isWin(this.playersCards)) {
                    this.endTurn('win');
                } else if (this.pointsController.isBust(this.playersCards)) {
                    this.endTurn('playerBust');
                } else {
                    const isSplitAllowed = this.pointsController.isSplitAllowed(this.playersCards);
                    this.gameView.render(this.roundModel.roundStateInfo, isSplitAllowed);
                    return;
                }
                break;

            case ERoundState.SPLIT_TURN:
                if (this.splitCards.length < 2) this.dealCardTo('split');
                if (this.pointsController.isWin(this.splitCards)) {
                    this.endTurn('win');
                } else if (this.pointsController.isBust(this.splitCards)) {
                    this.endTurn('playerBust');
                } else {
                    this.gameView.render(this.roundModel.roundStateInfo);
                }
                break;

            case ERoundState.DEALERS_TURN:
                this.gameView.render(this.roundModel.roundStateInfo)
                await this.revealHoleCard();
                if (this.pointsController.isBust(this.dealersCards)) {
                    this.dealerBust();
                } else await this.dealerPlay();
                break;

            case ERoundState.ROUND_OVER:
                this.gameView.render(this.roundModel.roundStateInfo)
                break;
        }
    }

    private changeState(state: ERoundState) {
        if (this.roundModel.state !== state) this.roundModel.state = state;
        console.log(`%cEnabled state: ${ERoundState[state]}`, "color: green");
        this.handleNextAction(state);
    }

    private onRoundStart() {
        if (this.roundModel.state !== ERoundState.BETTING) this.changeState(ERoundState.BETTING);
        this.bettingController.setInitialBet();
    }

    private onBetPlaced() {
        this.changeState(ERoundState.CARDS_DEALING);
    }

    private dealCardTo(person: TParticipants, doubleDown?: boolean) {
        return new Promise((resolve) => {
            const card = this.deck.getCard();
            if (!card) {
                console.error("No more cards in deck!");
                return;
            };
            this.roundModel.dealTo(person, card);
            const totalPoints = this.pointsFrom(this.roundModel.cards[person]);
            Main.signalController.card.deal.emit({ person, card, totalPoints, resolve });
        })
    }

    private async onPlayerHit() {
        if (this.roundModel.state === ERoundState.PLAYERS_TURN) {
            await this.dealCardTo('player');
        } else if (this.roundModel.state === ERoundState.SPLIT_TURN) {
            await this.dealCardTo('split');
        }
        this.handleNextAction(this.roundModel.state);
    }

    private onPlayerStand() {
        if (this.roundModel.state === ERoundState.SPLIT_TURN) {
            this.changeState(ERoundState.DEALERS_TURN)
        }
        if (this.roundModel.state === ERoundState.PLAYERS_TURN) {
            this.roundModel.cards.split.length ? this.changeState(ERoundState.SPLIT_TURN) :
                this.changeState(ERoundState.DEALERS_TURN)
        }
    }

    private endTurn(result?: TResult) {
        if (result) this.roundModel.result = result;
        Main.signalController.player.endTurn.emit(this.roundModel.getResult());
        if (this.roundModel.state === ERoundState.PLAYERS_TURN && this.roundModel.cards.split.length) {
            this.changeState(ERoundState.SPLIT_TURN);
            return
        }

        if (this.roundModel.state === ERoundState.SPLIT_TURN) {
            this.changeState(ERoundState.DEALERS_TURN);
            return;
        }
        this.endRound();
    }

    private onPlayerDoubleDown() {
        const isDoubleDown = true;
        if (this.roundModel.state === ERoundState.PLAYERS_TURN) {
            this.dealCardTo('player', isDoubleDown);
            if (this.pointsController.isBust(this.playersCards)) {
                this.endTurn('playerBust');
            } else {
                this.onPlayerStand();
            }
        } else if (this.roundModel.state === ERoundState.SPLIT_TURN) {
            this.dealCardTo('split', isDoubleDown);
            if (this.pointsController.isBust(this.splitCards)) {
                this.endTurn('playerBust');
            } else {
                this.onPlayerStand();
            }
        }
    }

    private async onPlayerSplit() {
        if (this.roundModel.state !== ERoundState.PLAYERS_TURN) return;
        const secondCard = this.roundModel.cards.player.pop();
        secondCard && this.roundModel.cards.split.push(secondCard);
        await this.gameView.render(this.roundModel.roundStateInfo);
        this.dealCardTo('player');
        this.bettingController.onPlayerSplit();
    }

    private async dealerPlay() {
        if (this.pointsFrom(this.dealersCards) >= 17) {
            this.dealerStand();
            return;
        }
        await this.dealCardTo('dealer');
        this.handleNextAction(this.roundModel.state);
    }

    private dealerStand() {
        const playerResult = this.comparePoints(this.dealersCards, this.playersCards);
        const splitResult = this.splitCards.length && this.comparePoints(this.dealersCards, this.splitCards);

        if (!this.roundModel.getResult().main) this.roundModel.setResult(playerResult, 'player');
        if (splitResult && !this.roundModel.getResult().split) this.roundModel.setResult(splitResult, 'split');

        this.endTurn();
    }

    private dealerBust() {
        if (!this.roundModel.getResult().main) this.roundModel.setResult('dealerBust', 'player');
        if (!this.roundModel.getResult().split) this.splitCards.length && this.roundModel.setResult('dealerBust', 'split');

        this.endTurn();
    }

    private async endRound() {
        if (this.holeCard) {
            await this.revealHoleCard();
        };
        Main.signalController.round.end.emit(this.roundModel.getResult());
        this.changeState(ERoundState.ROUND_OVER);
    }

    private comparePoints(dealerCards: CardModel[], playerCards: CardModel[]) {
        return this.pointsController.isTie(dealerCards, playerCards) ? 'push' :
            this.pointsFrom(playerCards) > this.pointsFrom(dealerCards) ? 'win' : 'lose';
    }

    private async checkForDealerBJ() {
        if (!this.holeCard) return;
        let dealerPoints = this.pointsFrom(this.dealersCards);
        if (dealerPoints !== 10 && dealerPoints !== 11) return;
        let holeCardPoints = this.pointsController.getCardPoints(this.holeCard);
        if (dealerPoints + holeCardPoints === 21) {
            await this.revealHoleCard();
            return true;
        }
        return false
    }

    private async checkForBJ() {
        if (await this.checkForDealerBJ()) {
            this.roundModel.result = this.pointsController.isTie(this.dealersCards, this.playersCards) ? 'push' : 'dealerBJ';
            this.endTurn();
            return true;
        }
        if (this.pointsFrom(this.playersCards) === 21) {
            this.roundModel.result = 'playerBJ';
            this.endTurn();
            return true;
        }
        return false;
    }

    private async revealHoleCard() {
        if (!this.holeCard) return;

        return new Promise(resolve => {
            if (!this.holeCard) return;
            const card = this.holeCard;
            this.holeCard.hidden = false;
            const totalPoints = this.pointsFrom(this.dealersCards);
            Main.signalController.card.open.emit({ card, totalPoints, resolve });
        })
    }

    get dealersCards() {
        return this.roundModel.cards.dealer;
    }

    get playersCards() {
        return this.roundModel.cards.player;
    }

    get splitCards() {
        return this.roundModel.cards.split;
    }

    get holeCard() {
        if (!this.dealersCards[1].hidden) return null;
        return this.dealersCards[1];
    }

    private pointsFrom(cards: CardModel[]): number {
        return this.pointsController.calcPoints(cards);
    }

    public deactivate() {
        // Main.signalController.bet.updated.remove(this.onBetUpdated);
        Main.signalController.round.start.remove(this.onRoundStart);
        Main.signalController.bet.placed.remove(this.onBetPlaced);
        Main.signalController.player.hit.remove(this.onPlayerHit);
        Main.signalController.player.stand.remove(this.onPlayerStand);
        Main.signalController.player.double.remove(this.onPlayerDoubleDown);
        Main.signalController.player.split.remove(this.onPlayerSplit);
    }
}