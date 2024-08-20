import { Application, Container, DisplayObject, Sprite, Spritesheet, SpriteSource } from "pixi.js";
import { AssetsLoader } from "./AssetsLoader";
import { BoardView } from "./BoardView";


export class GameView {
    appStage: Container;
    cards: null | Spritesheet = null;
    constructor (app: Application) {
        this.appStage = app.stage;
    }

    async init () {
        // const assetsLoader = new AssetsLoader();
        await AssetsLoader.init();
        const board = new BoardView();
        board.init();
        this.appStage.addChild(board);
        // const card = await AssetsLoader.getTexture('7_of_Hearts')s
        // this.appStage.addChild(new Sprite(card))
    }
}