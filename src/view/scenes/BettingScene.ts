import { Container } from "pixi.js";
import { BetPanel } from "./sceneComponents/BetPanel";
import { Main } from "../../main";

export class BettingScene extends Container {
    betPanel: BetPanel;

        constructor(bets: number[]) {
        super();
        
        this.betPanel = new BetPanel(bets);
        this.init();
    }

    init() {
        this.setPanels();
    }

    async setPanels() {
        this.betPanel.position.set(0, Main.screenSize.height);
        this.addChild(this.betPanel);
    }
}