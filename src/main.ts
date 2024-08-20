import { Application } from "pixi.js";
import { RoundController } from "./controller/RoundController";
import { RoundModel } from "./model/RoundModel";
import { GameView } from "./view/GameView";

class Main {
    public static APP: Application;
    app: Application;

    constructor() {
        this.app = new Application({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x000000,
    });
    }

    init() {
        Main.APP = this.app;
        document.body.appendChild(this.app.view as HTMLCanvasElement);
        window.addEventListener("resize", ()=> {
            this.app.renderer.resize(innerWidth, innerHeight);
        });

        const round = new RoundController(new RoundModel(), new GameView(this.app));
        round.init();
    }
}

const main = new Main();
main.init();