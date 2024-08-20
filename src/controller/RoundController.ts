import { DealerModel } from "../model/DealerModel";
import { DeckModel } from "../model/DeckModel";
import { HandModel } from "../model/HandModel";
import { Person } from "../model/Person";
import { PlayerModel } from "../model/PlayerModel";
import { ERoundState, RoundModel } from "../model/RoundModel";
import { GameView } from "../view/GameView";

export class RoundController {
    private roundModel: RoundModel;
    private gameView: GameView;
    private deck: DeckModel;
    private dealer: DealerModel;
    private player: PlayerModel;
    private participants: Person[] = [];

    constructor(roundModel: RoundModel, gameView: GameView) {
        this.gameView = gameView;
        this.gameView.init();
        this.roundModel = roundModel;
        this.deck = new DeckModel();
        this.dealer = new DealerModel();
        this.player = new PlayerModel();
        this.participants.push(this.player, this.dealer);
    }
    
    init() {
        this.handleNextAction(this.roundModel.currentState);
    }

    handleNextAction = (nextState: ERoundState) => {
        switch (nextState) {
            case ERoundState.NOT_STARTED:
                this.roundModel.startNewRound();
                this.handleNextAction(this.roundModel.currentState);
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
}