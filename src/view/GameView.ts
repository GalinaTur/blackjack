import { Application, Container, DisplayObject, Sprite, Spritesheet, SpriteSource } from "pixi.js";
import { AssetsLoader } from "./AssetsLoader";


export class GameView {
    appStage: Container;
    cards: null | Spritesheet = null;
    constructor (app: Application) {
        this.appStage = app.stage;
    }

    async init () {
        // const assetsLoader = new AssetsLoader();
        await AssetsLoader.init();
        const bg = await AssetsLoader.getTexture('background');
        const card = await AssetsLoader.getTexture('7_of_Hearts')
        console.log(card)
        this.appStage.addChild(new Sprite(bg))
        this.appStage.addChild(new Sprite(card))
    }
}