import { DealerModel } from "../model/DealerModel";
import { DeckModel } from "../model/DeckModel";
import { Person } from "../model/Person";
import { PlayerModel } from "../model/PlayerModel";
import { ERoundState, ICardsDealed, IPoints, RoundModel } from "../model/RoundModel";
import { GameView } from "../view/GameView";
import { Main } from "../main";
import { BettingController } from "./BettingController";
import { CardModel } from "../model/CardModel";
import { PointsController } from "./PointsController";
import { IPoint } from "pixi.js";

export class RoundController {
    private roundModel: RoundModel;
    private gameView: GameView;
    private deck: DeckModel;
    private dealer: DealerModel;
    private player: PlayerModel;
    private participants: Person[] = [];
    private bettingController: BettingController;
    private pointsController: PointsController;

    constructor(roundModel: RoundModel, gameView: GameView) {
        this.gameView = gameView;
        this.gameView.init();
        this.roundModel = roundModel;
        this.deck = new DeckModel();
        this.dealer = new DealerModel();
        this.player = new PlayerModel();
        this.participants.push(this.player, this.dealer);
        this.bettingController = new BettingController(this.player.balance);
        this.pointsController = new PointsController();
        this.init();
        Main.APP.ticker.add(() => {
            // this.handleNextAction(this.roundModel.currentState);
        });
    }

    async init() {
        this.handleNextAction(this.roundModel.roundStateInfo.currentState);
        Main.signalController.roundStart.add(this.onRoundStart, this);
        Main.signalController.bet.placed.add(this.onBetPlaced, this);
        Main.signalController.player.hit.add(this.onPlayerHit, this);
    }

    handleNextAction = (nextState: ERoundState) => {
        switch (nextState) {
            case ERoundState.NOT_STARTED:
                this.gameView.renderInitialScene();
                this.roundModel.roundStateInfo.isStarted &&
                    this.handleNextAction(this.roundModel.roundStateInfo.currentState);
                break;
            case ERoundState.BETTING:
                this.gameView.renderHeaderPanel(this.bettingController.betSize);
                this.gameView.renderBettingScene(this.bettingController.bets);
                break;
            case ERoundState.CARDS_DEALING:
                this.gameView.renderGameScene(this.roundModel.cards, this.roundModel.points);
                this.deck.shuffle();
                this.dealCardTo('dealer');
                this.dealCardTo('player');
                this.roundModel.isDealingEnded();
                this.handleNextAction(this.roundModel.roundStateInfo.currentState);
                break;
            case ERoundState.PLAYERS_TURN:
            console.log("player's turn")
                break;
            case ERoundState.DEALERS_TURN:
                console.log("dealer's turn")
                break;
            case ERoundState.ROUND_OVER:
                console.log('game Over');
                break;
            // 
        }
    }

    dealCardTo(person: keyof ICardsDealed) {
        const card = this.deck.getCard();
        card && this.roundModel.dealTo(person, card);
        const points = this.pointsController.calculate(this.roundModel.cards[person])
        this.roundModel.setPoints(person as keyof IPoints, points);
        Main.signalController.card.deal.emit();
    }

    updatePoints() {

    }

    onRoundStart() {
        this.roundModel.isStarted = true;
        this.handleNextAction(this.roundModel.roundStateInfo.currentState);
    }

    onBetPlaced() {
        this.roundModel.bet = this.bettingController.betSize;
        this.handleNextAction(this.roundModel.roundStateInfo.currentState);
    }

    onPlayerHit() {
        this.dealCardTo('player');
    }
}