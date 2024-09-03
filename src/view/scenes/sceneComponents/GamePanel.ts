import { Container, Sprite } from "pixi.js";
import { Main } from "../../../main";
import { Button } from "./Button";
import { DropShadowFilter } from "pixi-filters";
import { Effects } from "../../styles/Effects";
import { IPanel } from "../../GameView";

export class GamePanel extends Container implements IPanel {
    private background: Sprite | null = null;
    private splitButton: Button;
    private doubleButton: Button;
    private hitButton: Button;
    private standButton: Button;
    private dropShadowFilter: DropShadowFilter;

    constructor() {
        super();
        this.splitButton = new Button('Split', this.onSplit, true);
        this.doubleButton = new Button('Double', this.onDouble, true);
        this.hitButton = new Button('Hit', this.onHit, true);
        this.standButton = new Button('Stand', this.onStand, true);

        this.setBackground()
        .then(this.setButtons.bind(this))

        this.dropShadowFilter = new DropShadowFilter(Effects.FOOTER_PANEL_DROP_SHADOW);

        this.filters = [this.dropShadowFilter];
    }

    async setBackground() {
        this.background = await Main.assetsLoader.getSprite('game_panel');
        this.background.anchor.y = 1
        this.resize();
        this.addChild(this.background);
    }

    private setButtons() {
        this.splitButton.position.set(120, -50);
        this.splitButton.scale.set(0.7);
        this.addChild(this.splitButton);

        this.doubleButton.position.set(340,-50);
        this.doubleButton.scale.set(0.7);
        this.addChild(this.doubleButton);

        this.hitButton.position.set(560,-50);
        this.hitButton.scale.set(0.7);
        this.addChild(this.hitButton);

        this.standButton.position.set(780,-50);
        this.standButton.scale.set(0.7);
        this.addChild(this.standButton);
    }

    private resize() {
        if (this.background === null) return;
        const bgRatio = this.background.height / this.background.width;

        this.background.width = Main.screenSize.width;
        this.background.height = this.background.width*bgRatio*0.65;
    }

    
    private onHit() {
        Main.signalController.player.hit.emit();
    }
    
    private onStand() {
        Main.signalController.player.stand.emit();
    }

    private onDouble() {
        Main.signalController.player.double.emit();
    }

    private onSplit() {
        Main.signalController.player.split.emit();
    }

    private onResize() {
        this.resize();
    }

    public deactivate(): void {
        
    }
}