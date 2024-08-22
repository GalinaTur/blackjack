import { Application, Container, Spritesheet } from "pixi.js";
import { BoardView } from "./BoardView";
import { Main } from "../main";
import { Background } from "./scenes/sceneComponents/Background";
import { InitialScene } from "./scenes/InitialScene";
import { GameScene } from "./scenes/GameScene";


export class GameView extends Container {
    appStage: Container;
    board = new BoardView();
    cards: null | Spritesheet = null;
    currentScene: Container | null = null;

    constructor(app: Application) {
        super();
        this.appStage = app.stage;
        this.appStage.addChild(this);
        Main.APP.ticker.add(() => {
            this.resize();
        })
    }

    init() {
        const background = new Background();
        this.addChild(background);
    }

    renderInitialScene() {
        const initialScene = new InitialScene();
        this.currentScene = this.addChild(initialScene);
    }

    renderGameScene() {
        const gameScene = new GameScene();
        this.currentScene = this.addChild(gameScene);
    }

    resize() {
        this.board.setBackgroundSize();
    }
}