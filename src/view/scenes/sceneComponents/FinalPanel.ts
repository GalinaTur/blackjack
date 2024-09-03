import { Container, Sprite } from "pixi.js";
import { Main } from "../../../main";
import { Button } from "./Button";
import { DropShadowFilter } from "pixi-filters";
import { Effects } from "../../styles/Effects";
import { IPanel } from "../../GameView";

export class FinalPanel extends Container implements IPanel {
    private background: Sprite | null = null;
    private rebetButton: Button;
    private newHandButton: Button;
    private dropShadowFilter: DropShadowFilter;

    constructor() {
        super();
        this.rebetButton = new Button('Rebet', this.onRebet, true);
        this.newHandButton = new Button('New Hand', this.onNewHand, true);

        this.setBackground()
            .then(this.setButtons.bind(this))

        this.dropShadowFilter = new DropShadowFilter(Effects.FOOTER_PANEL_DROP_SHADOW);

        this.filters = [this.dropShadowFilter];
    }

    private async setBackground() {
        this.background = await Main.assetsLoader.getSprite('game_panel');
        this.background.anchor.y = 1
        this.resize();
        this.addChild(this.background);
    }

    private setButtons() {
        this.rebetButton.position.set(180, -50);
        this.rebetButton.scale.set(0.7);
        this.addChild(this.rebetButton);

        this.newHandButton.position.set(400, -50);
        this.newHandButton.scale.set(0.7);
        this.addChild(this.newHandButton);
    }

    private resize() {
        if (this.background === null) return;
        const bgRatio = this.background.height / this.background.width;

        this.background.width = Main.screenSize.width;
        this.background.height = this.background.width * bgRatio * 0.65;
    }

    private onRebet() {
        console.log('rebet')
        Main.signalController.round.new.emit();
    }
    
    private onNewHand() {
    }

    private onResize() {
        this.resize();
    }

    public deactivate(): void {
        
    }
}