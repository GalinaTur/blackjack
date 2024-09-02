import { Container } from "pixi.js";
import { BetPanel } from "./sceneComponents/BetPanel";
import { Main } from "../../main";
import { IScene } from "../GameView";

export class BettingScene extends Container implements IScene<number> {
    betPanel: BetPanel;

        constructor(bets: number[], betSize: number) {
        super();
        
        this.betPanel = new BetPanel(bets, betSize);
        this.init();
    }

    init() {
        this.setPanels();
        Main.signalController.bet.updated.add(this.onUpdate, this);
    }

    async setPanels() {
        this.betPanel.position.set(0, Main.screenSize.height);
        this.addChild(this.betPanel);
    }

    onUpdate(betSize: number) {
        this.betPanel.onUpdate(betSize);
    }

    onResize(): void {
        
    }
}