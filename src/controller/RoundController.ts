import { DealerModel } from "../model/DealerModel";
import { DeckModel } from "../model/DeckModel";
import { Person } from "../model/Person";
import { PlayerModel } from "../model/PlayerModel";
import { ERoundState, RoundModel } from "../model/RoundModel";
import { GameView } from "../view/GameView";
import { Main } from "../main";

export class RoundController {
    private roundModel: RoundModel;
    private gameView: GameView;
    private deck: DeckModel;
    private dealer: DealerModel;
    private player: PlayerModel;
    private participants: Person[] = [];
    isRoundStarted = false;

    constructor(roundModel: RoundModel, gameView: GameView) {
        this.gameView = gameView;
        this.gameView.init();
        this.roundModel = roundModel;
        this.deck = new DeckModel();
        this.dealer = new DealerModel();
        this.player = new PlayerModel();
        this.participants.push(this.player, this.dealer);
        this.init();
        Main.APP.ticker.add(() => {
            // this.handleNextAction(this.roundModel.currentState);
        });
    }

    async init() {
        this.gameView.renderInitialScene();
        this.handleNextAction(this.roundModel.currentState);
        Main.signalController.roundStart.add(this.startRound, this);
    }

    handleNextAction = (nextState: ERoundState) => {
        console.log('current state:'+ this.roundModel.currentState)
        switch (nextState) {
            case ERoundState.NOT_STARTED:
                this.roundModel.checkRoundStarted(this.isRoundStarted);
                console.log('ds')
                break;
            case ERoundState.BETTING:
                this.roundModel.playerBet(100);
                this.handleNextAction(this.roundModel.currentState);
                break;
            case ERoundState.CARDS_DEALING:
                for (let person of this.participants) {
                    this.dealCardTo(person);
                }
                this.roundModel.confirmDealingEnded(this.dealer.mainHand.cards);
                this.handleNextAction(this.roundModel.currentState);
                break;
            case ERoundState.PLAYERS_TURN:

                break;
            case ERoundState.DEALERS_TURN:

                break;
            case ERoundState.ROUND_OVER:
                console.log('game Over');
                break;
            // 
        }
    }

    dealCardTo(person: Person) {
        const card = this.deck.getCard();
        if (card) person.drawCard(card);
    }

    startRound() {
        if (!this.gameView.currentScene) return;
        this.isRoundStarted = true;
        this.gameView.removeChild(this.gameView.currentScene);
        this.gameView.renderGameScene();
        this.handleNextAction(this.roundModel.currentState);
    }
}