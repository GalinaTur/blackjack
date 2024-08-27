import { Application, settings } from "pixi.js";
import { RoundController } from "./controller/RoundController";
import { RoundModel } from "./model/RoundModel";
import { GameView } from "./view/GameView";
import { SignalsController } from "./controller/SignalsController";
import { AssetsLoader } from "./controller/AssetsController";

export class Main {
    public static APP: Application;
    public static signalController = new SignalsController();
    public static assetsLoader = new AssetsLoader();
    public static screenSize: { width: number; height: number } = {
        width: window.innerWidth,
        height: window.innerHeight,
    }
    app: Application;

    constructor() {
        this.app = new Application({
            backgroundColor: 0x000000,
            resizeTo: window,
            antialias: true,
            eventMode: "auto",
            eventFeatures: {
                globalMove: true,
                move: true,
                click: true,
            },
        });
        (globalThis as any).__PIXI_APP__ = this.app;
        this.app.ticker.add(() => {
            Main.screenSize = {
                width: window.innerWidth,
                height: window.innerHeight,
            }
        })
        this.app.ticker.start();
        this.app.stage.sortableChildren = true;
    }

    async init() {
        Main.APP = this.app;
        document.body.appendChild(this.app.view as HTMLCanvasElement);
        await Main.assetsLoader.init();
        const round = new RoundController(new RoundModel(), new GameView(this.app));
    }
}

// settings.ROUND_PIXELS = true;
// settings.RESOLUTION = 2;

const main = new Main();
main.init();