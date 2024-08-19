import { RoundModel } from "../model/RoundModel";
import { GameView } from "../view/GameView";

export class RoundController {
    private roundModel: RoundModel;
    private gameView: GameView;

    constructor(roundModel: RoundModel, gameView: GameView) {
        this.roundModel = roundModel;
        this.gameView = gameView;

        this.gameView.init();
    }

    init() {
        this.roundModel.resetRound();
    }

}