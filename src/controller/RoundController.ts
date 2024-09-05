import { DeckModel } from "../model/DeckModel";
import { RoundModel } from "../model/RoundModel";
import { GameView } from "../view/GameView";
import { Main } from "../main";
import { BettingController } from "./BettingController";
import { PointsController } from "./PointsController";
import { ERoundState, TParticipants, TRoundResult } from "../data/types";

export class RoundController {
    public roundModel: RoundModel;
    private gameView: GameView;
    private deck = new DeckModel();
    private pointsController = new PointsController();

    constructor(roundModel: RoundModel, gameView: GameView) {
        this.gameView = gameView;
        this.roundModel = roundModel;
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
        Main.signalController.round.end.add(this.deactivate, this);
    }

    private async handleNextAction(state: ERoundState) {
        let dealTo: TParticipants = 'player';
        switch (state) {
            case ERoundState.BETTING:
                console.log('betting')
                break;

            case ERoundState.CARDS_DEALING:
                console.log('cards dealing')
                while (!this.roundModel.isDealingEnded()) {
                    await this.dealCardTo(dealTo)
                    dealTo = dealTo === 'player' ? 'dealer' : 'player';
                }
                !this.checkForBJ() && this.changeState(ERoundState.PLAYERS_TURN);
                break;

            case ERoundState.PLAYERS_TURN:
                console.log("player's turn");
                if (this.pointsController.isWin(this.playersCards)) this.endRound('win');
                if (this.pointsController.isBust(this.playersCards)) this.endRound('playerBust');
                break;

            case ERoundState.DEALERS_TURN:
                console.log("dealer's turn");
                await this.revealHoleCard();
                if (this.pointsController.isBust(this.dealersCards)) {
                    this.endRound('dealerBust');
                } else await this.dealerPlay();
                break;

            case ERoundState.ROUND_OVER:
                this.gameView.render(this.roundModel.roundStateInfo)
                console.log('game Over');
                break;
        }
    }

    private changeState(state: ERoundState) {
        this.roundModel.state = state;
        Main.signalController.round.changeState.emit(this.roundModel.roundStateInfo);
        this.handleNextAction(state);
    }

    private onRoundStart() {
        this.changeState(ERoundState.BETTING);
    }

    private onBetPlaced() {
        this.changeState(ERoundState.CARDS_DEALING);
    }

    private dealCardTo(person: TParticipants) {
        return new Promise((resolve) => {
            const card = this.deck.getCard();
            if (!card) return;
            this.roundModel.dealTo(person, card);
            const totalPoints = this.pointsController.calcPoints(this.roundModel.cards[person]);
            Main.signalController.card.deal.emit({ person, card, totalPoints, resolve });
        })
    }

    private async onPlayerHit() {
        if (this.roundModel.state !== ERoundState.PLAYERS_TURN) return;
        await this.dealCardTo('player');
        this.handleNextAction(this.roundModel.state);
    }

    private onPlayerStand() {
        if (this.roundModel.state !== ERoundState.PLAYERS_TURN) return;
        this.changeState(ERoundState.DEALERS_TURN);
    }

    private async dealerPlay() {
        if (this.pointsController.calcPoints(this.dealersCards) >= 17) {
            this.dealerStand();
            return;
        }
        await this.dealCardTo('dealer');
        this.handleNextAction(this.roundModel.state);
    }

    private dealerStand() {
        this.comparePoints();
    }

    private async endRound(result: TRoundResult) {
        console.log(result);
        if (this.holeCard) {
            await this.revealHoleCard();
        };
        this.roundModel.result = result;
        Main.signalController.round.end.emit(result);
        this.changeState(ERoundState.ROUND_OVER);
    }

    private comparePoints() {
        this.pointsController.isTie(this.roundModel.cards) ? this.endRound('push') :
            this.pointsController.calcPoints(this.playersCards) > this.pointsController.calcPoints(this.dealersCards) ?
                this.endRound('win') : this.endRound('lose');
    }

    private async checkForDealerBJ() {
        if (!this.holeCard) return;
        let dealerPoints = this.pointsController.calcPoints(this.dealersCards);
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
            this.pointsController.isTie(this.roundModel.cards) ? this.endRound('push') : this.endRound('dealerBJ');
            return true;
        }
        if (this.pointsController.calcPoints(this.playersCards) === 21) {
            this.endRound('playerBJ');
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
            const totalPoints = this.pointsController.calcPoints(this.dealersCards);
            Main.signalController.card.open.emit({ card, totalPoints, resolve });
        })
    }

    get dealersCards() {
        return this.roundModel.cards.dealer;
    }

    get playersCards() {
        return this.roundModel.cards.player;
    }

    get holeCard() {
        if (!this.dealersCards[1].hidden) return null;
        return this.dealersCards[1];
    }

    private deactivate() {
        Main.signalController.round.start.remove(this.onRoundStart);
        Main.signalController.bet.placed.remove(this.onBetPlaced);
        Main.signalController.player.hit.remove(this.onPlayerHit);
        Main.signalController.player.stand.remove(this.onPlayerStand);
        Main.signalController.round.end.remove(this.deactivate);
    }
}