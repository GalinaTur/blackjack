import { Application } from "pixi.js";
import { RoundModel } from "../model/RoundModel";
import { GameView } from "../view/GameView";
import { RoundController } from "./RoundController";
import { Main } from "../main";

export class GameController {
    private app: Application;
    private round: RoundController;
    private playerBalance = 1000;

    constructor(app: Application) {
        this.app = app;
        this.round = new RoundController(new RoundModel(), new GameView(this.app))
    }

    init() {
        Main.signalController.round.new.add(this.newRound, this);
    }

    newRound() {
        this.round = new RoundController(new RoundModel(), new GameView(this.app))
    }
}