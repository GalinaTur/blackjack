import { RoundModel } from "../model/RoundModel";
import { GameView } from "../view/GameView";
import { Main } from "../main";
import { BettingController } from "./BettingController";
import { PointsController } from "./PointsController";
import { ERoundState, IRoundStateDTO } from "../data/types";
import { PlayerController } from "./PlayerController";
import { DealerController } from "./DealerController";

export class RoundController {
    public roundModel: RoundModel;
    private gameView: GameView;
    private pointsController = new PointsController();
    private bettingController: BettingController;
    private playerController: PlayerController;
    private dealerController: DealerController;

    constructor(roundModel: RoundModel, gameView: GameView, bettingController: BettingController) {
        this.gameView = gameView;
        this.roundModel = roundModel;
        this.bettingController = bettingController;
        this.playerController = new PlayerController(this, this.pointsController, this.roundModel.mainHand);
        this.dealerController = new DealerController(this, this.pointsController, this.roundModel.dealerHand);
        this.init();
    }

    private async init() {
        this.setEventListeners();
        this.handleNextAction();
    }

    private setEventListeners() {
        Main.signalController.round.start.add(this.onRoundStart, this);
        Main.signalController.bet.placed.add(this.onBetPlaced, this);
    }

    public async handleNextAction() {
        let roundStateDTO = this.getRoundStateInfo();
        switch (this.roundModel.state) {
            case ERoundState.NOT_STARTED:
                this.gameView.render(roundStateDTO)
                break;
            case ERoundState.BETTING:
                this.gameView.render(roundStateDTO)
                break;

            case ERoundState.CARDS_DEALING:
                let controller: PlayerController | DealerController = this.playerController;
                roundStateDTO = this.getRoundStateInfo();
                this.gameView.render(roundStateDTO)
                while (!this.roundModel.isDealingEnded()) {
                    await controller.dealCard();
                    controller = controller === this.playerController ? this.dealerController : this.playerController;
                }
                if (! await this.checkForAnyBJ()) this.goToNextState();
                break;

            case ERoundState.PLAYERS_TURN:
                const isSplitAllowed = this.pointsController.isSplitAllowed(this.roundModel.mainHand.cards);
                await this.playerController.handleTurn();
                if (this.playerController.hand !== this.roundModel.mainHand) return;
                roundStateDTO = this.getRoundStateInfo();
                await this.gameView.render(roundStateDTO, isSplitAllowed);
                break;

            case ERoundState.SPLIT_TURN:
                if (this.roundModel.splitHand) this.playerController.setHand(this.roundModel.splitHand);
                await this.playerController.handleTurn();
                roundStateDTO = this.getRoundStateInfo();
                await this.gameView.render(roundStateDTO);
                break;

            case ERoundState.DEALERS_TURN:
                this.gameView.render(roundStateDTO);
                this.dealerController.handleTurn();
                break;

            case ERoundState.ROUND_OVER:
                await this.gameView.render(roundStateDTO)
                break;
        }
    }

    public goToNextState() {
        this.roundModel.goToNextState();
        console.log(`%cEnabled state: ${ERoundState[this.roundModel.state]}`, "color: green");
        Main.signalController.round.stateChanged.emit(this.roundModel.state);
        if (this.roundModel.state === ERoundState.ROUND_OVER) this.endRound();
        this.handleNextAction();
    }

    private onRoundStart() {
        if (this.roundModel.state !== ERoundState.BETTING) this.goToNextState();
        this.bettingController.setInitialBet();
    }

    private onBetPlaced() {
        this.goToNextState();
    }

    private getRoundStateInfo(): IRoundStateDTO {
        return {
            currentState: this.roundModel.state,
            availableBets: this.bettingController.setAvailableBets(),
            bet: this.roundModel.betSize,
            win: this.roundModel.winSize,
            cards: {
                main: this.roundModel.mainHand.cards,
                dealer: this.roundModel.dealerHand.cards,
                split: this.roundModel.splitHand && this.roundModel.splitHand.cards
            },
            isSplitAllowed: this.pointsController.isSplitAllowed(this.roundModel.mainHand.cards),
            roundResult: this.roundModel.getResult(),
        }
    }

    public endTurn() {
        const roundResult = this.roundModel.getResult();
        Main.signalController.player.endTurn.emit(roundResult);

        if (roundResult.main && (!this.roundModel.splitHand || roundResult.split)) {
            this.endRound();
            return;
        }

        this.goToNextState();
    }

    public async onPlayerSplit() {
        this.roundModel.split();
        const roundStateDTO = this.getRoundStateInfo();
        await this.gameView.render(roundStateDTO);
        this.bettingController.onPlayerSplit();
    }

    public async endRound() {
        if (this.roundModel.dealerHand.holeCardIndex) await this.dealerController.revealHoleCard();
        Main.signalController.round.end.emit(this.roundModel.getResult());
        this.roundModel.endRound();
        this.handleNextAction();
    }

    private async checkForAnyBJ() {
        const isPlayerBJ = this.playerController.checkForBJ();
        const isDealerBJ = await this.dealerController.checkForBJ();
        if (isDealerBJ && isPlayerBJ) {
            this.roundModel.setResult('push');
            this.endTurn();
            return true;
        }
        if (isPlayerBJ) {
            this.roundModel.setResult('playerBJ');
            this.endTurn();
            return true;
        }
        if (isDealerBJ) {
            this.roundModel.setResult('dealerBJ');
            this.endTurn();
            return true;
        }
        return false;
    }

    get playersCards() {
        return this.roundModel.mainHand.cards;
    }

    public deactivate() {
        this.playerController.deactivate();
        Main.signalController.round.start.remove(this.onRoundStart);
        Main.signalController.bet.placed.remove(this.onBetPlaced);
    }
}