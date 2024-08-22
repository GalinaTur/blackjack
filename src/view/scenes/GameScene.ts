import { Container } from "pixi.js";
import { BetPanel } from "./sceneComponents/BetPanel";
import { Main } from "../../main";

export class GameScene extends Container {
    betPanel = new BetPanel();
    // balancePanel: BetPanel | null = null;

        constructor() {
        super();
        this.init();
    }

    init() {
        this.setPanels();
    }

    async setPanels() {
        this.betPanel.position.set(0, Main.screenSize.height)
        this.addChild(this.betPanel);
    }

    // onStartClick() {
    //     Main.signalController.roundStart.emit();
    // }
}