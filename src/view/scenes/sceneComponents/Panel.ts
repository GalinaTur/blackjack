import { Container, Sprite } from "pixi.js";
import { IPanel } from "../../../data/types";
import { DropShadowFilter } from "pixi-filters";
import { Effects } from "../../styles/Effects";
import { Main } from "../../../main";

export class Panel extends Container implements IPanel {
    protected background: Sprite | null = null;
    // protected dropShadowFilter: DropShadowFilter;
    private backgroundName: string = "";

    constructor(name: string) {
        super();
        this.backgroundName = name;
        // this.dropShadowFilter = new DropShadowFilter(Effects.FOOTER_PANEL_DROP_SHADOW);

        this.init();
    }

    protected async init(): Promise<void> {
        // await this.setBackground();
        // this.filters = [this.dropShadowFilter];
    }

    private async setBackground(): Promise<void> {
        this.background = await Main.assetsLoader.getSprite(this.backgroundName);
        this.background.anchor.y = 1
        this.resize();
        this.addChild(this.background);
    }

    private resize() {
        if (this.background === null) return;
        const bgRatio = this.background.height / this.background.width;

        this.background.width = Main.screenSize.width;
        this.background.height = this.background.width * bgRatio * 0.65;
    }

    public deactivate(): void {

    }
}