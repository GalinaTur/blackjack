import { Application } from "pixi.js";
import { RoundController } from "./controller/RoundController";
import { RoundModel } from "./model/RoundModel";
import { GameView } from "./view/GameView";

class Main {
    init() {
        const app = new Application({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x000000,
    });
        document.body.appendChild(app.view as HTMLCanvasElement);
        window.addEventListener("resize", ()=> {
            app.renderer.resize(innerWidth, innerHeight);
        });

        const round = new RoundController(new RoundModel(), new GameView(app));
    }
}

const main = new Main();
main.init();