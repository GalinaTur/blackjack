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
        await Main.assetsLoader.init();
        this.gameController = new GameController(this.app);
        document.body.appendChild(this.app.view as HTMLCanvasElement);
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

window.addEventListener('resize', () => {
    Main.screenSize = {
        width: window.innerWidth,
        height: window.innerHeight,
    }
    Main.APP.renderer.resize(Main.screenSize.width, Main.screenSize.height);
    main.onResize()

    requestAnimationFrame(() => Main.APP.render());
});

gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(Main.APP);