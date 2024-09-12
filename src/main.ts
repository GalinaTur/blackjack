import { Application } from "pixi.js";
import { SignalsController } from "./controller/SignalsController";
import { AssetsLoader } from "./controller/AssetsController";
import { GameController } from "./controller/GameController";
import PixiPlugin from "gsap/PixiPlugin";
import gsap from "gsap";

export class Main {
    public static APP: Application;
    public static signalController = new SignalsController();
    public static assetsLoader = new AssetsLoader();
    public static screenSize: { width: number; height: number } = {
        width: window.innerWidth,
        height: window.innerHeight,
    }
    private _app: Application;

    constructor() {
        this._app = new Application({
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

        this.app.ticker.stop();
        gsap.ticker.add(() => {
            this.app.render();
        });

        (globalThis as any).__PIXI_APP__ = this.app;
        gsap.ticker.add(() => {
            Main.screenSize = {
                width: window.innerWidth,
                height: window.innerHeight,
            }
        })
        this.app.ticker.start();
        this.app.stage.sortableChildren = true;
    }

    get app() {
        return this._app;
    }

    public async init() {
        Main.APP = this.app;
        document.body.appendChild(this.app.view as HTMLCanvasElement);
        await Main.assetsLoader.init();
        const gameController = new GameController(this.app);
        gameController.init();
    }
}

const main = new Main();
main.init();

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(Main.APP);