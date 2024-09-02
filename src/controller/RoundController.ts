import { DeckModel } from "../model/DeckModel";
import { ERoundState, RoundModel, TRoundResult } from "../model/RoundModel";
import { GameView } from "../view/GameView";
import { Main } from "../main";
import { BettingController } from "./BettingController";
import { PointsController } from "./PointsController";
import { CardModel } from "../model/CardModel";
import { BetModel } from "../model/BetModel";

export class RoundController {
    private roundModel: RoundModel;
    private gameView: GameView;
    private deck = new DeckModel();
    private betModel = new BetModel();;
    private bettingController = new BettingController(this.betModel);
    private pointsController = new PointsController();

    constructor(roundModel: RoundModel, gameView: GameView) {
        this.gameView = gameView;
        this.roundModel = roundModel;
        this.init();
    }

    private async init() {
        this.gameView.init();
        this.setEventListeners();
        this.handleNextAction(this.roundModel.roundStateInfo.currentState);
    }

    private setEventListeners() {
        Main.signalController.round.start.add(this.onRoundStart, this);
        Main.signalController.bet.placed.add(this.onBetPlaced, this);
        Main.signalController.player.hit.add(this.onPlayerHit, this);
        Main.signalController.player.stand.add(this.onPlayerStand, this);
        Main.signalController.card.deal.add(this.updatePoints, this);
    }

    private handleNextAction = (nextState: ERoundState) => {
        switch (nextState) {
            case ERoundState.NOT_STARTED:
                this.gameView.renderInitialScene();
                this.roundModel.roundStateInfo.isStarted &&
                    this.handleNextAction(this.roundModel.roundStateInfo.currentState);
                break;
            case ERoundState.BETTING:
                this.gameView.renderHeaderPanel(this.betModel.betSize);
                this.gameView.renderBettingScene(this.betModel.bets, this.betModel.betSize);
                break;
            case ERoundState.CARDS_DEALING:
                console.log('cards dealing')
                this.gameView.renderGameScene(this.roundModel.cards, this.roundModel.points);
                this.dealCard('dealer');
                this.dealCard('player');
                this.roundModel.isDealingEnded() &&
                    // this.endRound('playerBJ') //debuger
                    this.checkForBJ();
                this.handleNextAction(this.roundModel.roundStateInfo.currentState);
                break;
            case ERoundState.PLAYERS_TURN:
                console.log("player's turn")
                if (this.roundModel.isBust(this.pointsController.calcPoints(this.roundModel.cards.player))) this.endRound('playerBust');
                break;
            case ERoundState.DEALERS_TURN:
                console.log("dealer's turn");
                this.revealHoleCard(this.roundModel.cards.dealer[1]);
                this.updatePoints('dealer');
                this.dealerPlay();
                if (this.roundModel.isBust(this.roundModel.points.dealer)) this.endRound('dealerBust');
                break;
            case ERoundState.ROUND_OVER:
                console.log('game Over');
                break;
        }
    }

    private dealCard(person: TParticipants) {
        const card = this.deck.getCard();
        card && this.roundModel.dealTo(person, card);
        Main.signalController.card.deal.emit(person);
    }

    private onRoundStart() {
        this.roundModel.isStarted = true;
        this.handleNextAction(this.roundModel.roundStateInfo.currentState);
    }

    private onBetPlaced() {
        this.roundModel.isBetPlaced = true;
        this.gameView.update();
        this.handleNextAction(this.roundModel.roundStateInfo.currentState);
    }

    private onPlayerHit() {
        this.dealCard('player');
        this.handleNextAction(this.roundModel.roundStateInfo.currentState);
    }

    private onPlayerStand() {
        this.roundModel.startDealersTurn();
        this.handleNextAction(this.roundModel.roundStateInfo.currentState);
    }

    private dealerStand() {
        this.roundModel.comparePoints();
        this.handleNextAction(this.roundModel.roundStateInfo.currentState);
    }

    private dealerPlay() {
        if (this.roundModel.points.dealer >= 17) {
            this.dealerStand();
            return;
        }
        this.dealCard('dealer');
        this.handleNextAction(this.roundModel.roundStateInfo.currentState);
    }

    private endRound(result: TRoundResult) {
        console.log(result);
        if (this.roundModel.cards.dealer[1].hidden) {
            this.revealHoleCard(this.roundModel.cards.dealer[1]);
            this.updatePoints('dealer');
        };
        this.roundModel.endRound(result);
        Main.signalController.round.end.emit(result);
        this.handleNextAction(this.roundModel.roundStateInfo.currentState);
    }

    private checkForDealerBJ() {
        if (this.roundModel.points.dealer !== 10 && this.roundModel.points.dealer !== 11) return;
        let holeCardPoints = this.pointsController.getCardPoints(this.roundModel.cards.dealer[1]);
        if (this.roundModel.points.dealer + holeCardPoints === 21) {
            this.revealHoleCard(this.roundModel.cards.dealer[1]);
            this.updatePoints('dealer');
            return true;
        }
        return false
    }


    public checkForBJ() {
        if (this.checkForDealerBJ()) {
            this.roundModel.checkIfTie() ? this.endRound('push') : this.endRound('dealerBJ');
        }
        if (this.roundModel.points.player === 21) this.endRound('playerBJ');
    }


    private updatePoints(person: TParticipants) {
        const points = this.pointsController.calcPoints(this.roundModel.cards[person])
        this.roundModel.setPoints(person, points);
    }

    private revealHoleCard(card: CardModel) {
        card.hidden = false;
        Main.signalController.card.open.emit();
    }

    get playerPoints() {
        return this.pointsController.calcPoints(this.roundModel.cards.player);
    }

    get dealerPoints() {
        return this.pointsController.calcPoints(this.roundModel.cards.player);
    }
}

export type TParticipants = 'dealer' | 'player';