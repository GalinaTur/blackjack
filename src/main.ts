import { Application, Ticker } from "pixi.js";
import { SignalsController } from "./controller/SignalsController";
import { AssetsController } from "./controller/AssetsController";
import { GameController } from "./controller/GameController";
import gsap from "gsap";
import PixiPlugin from "gsap/PixiPlugin";
import { MotionPathPlugin } from "gsap/all";

export class Main {
    public static APP: Application;
    public static signalsController = new SignalsController();
    public static assetsController = new AssetsController();
    public static screenSize: { width: number; height: number } = {
        width: window.innerWidth,
        height: window.innerHeight,
    }
    private _app: Application;
    private gameController: GameController | null = null;

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
    }

    public async init() {
        (globalThis as any).__PIXI_APP__ = this.app;
        Main.APP = this.app;
        this.app.stage.sortableChildren = true;
        await Main.assetsController.init();
        this.gameController = new GameController(this.app);
        document.body.appendChild(this.app.view as HTMLCanvasElement);

        gsap.registerPlugin(PixiPlugin);
        gsap.registerPlugin(MotionPathPlugin);
        PixiPlugin.registerPIXI(this.app);

        let ticker = this.app.ticker;
        ticker.autoStart = false;
        ticker.stop();

        window.addEventListener('resize', () => {
            Main.screenSize = {
                width: window.innerWidth,
                height: window.innerHeight,
            }
            this.app.renderer.resize(Main.screenSize.width, Main.screenSize.height);
            this.onResize()

            requestAnimationFrame(() => this.app.render());
        });

        ticker.start();
    }

    get app() {
        return this._app;
    }

    public onResize() {
        this.app.renderer.resize(Main.screenSize.width, Main.screenSize.height);
        this.gameController?.onResize();
    }
}

const main = new Main();
main.init();