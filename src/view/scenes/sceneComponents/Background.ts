import { BlurFilter, Container, Sprite } from "pixi.js";
import { Main } from "../../../main";
import { Animations } from "../../styles/Animations";

export class Background extends Container {
    private background: Sprite | null = null;
    private logo: Sprite | null = null;

    public blurFilter = new BlurFilter(10, 1, 1);

    constructor() {
        super();
        this.setBackground()
            .then(this.setLogo.bind(this))
            .then(this.resize.bind(this));
    }

    private async setBackground(): Promise<void> {
        this.background = await Main.assetsLoader.getSprite('background');
        this.background.anchor.set(0.5);
        this.addChild(this.background);
    }

    private async setLogo(): Promise<void> {
        this.logo = await Main.assetsLoader.getSprite('bgLogo');
        this.logo.anchor.set(0.5);
        this.logo.scale.set(0.7, 0.5);
        this.logo.alpha = 0.4;
        this.addChild(this.logo);
    }

    private resize(): void {
        this.resizeBg()
        this.resizeLogo();
        this.centralize();
    }

    private resizeBg(): void {
        if (this.background === null) return;

        const bgRatio = this.background.width / this.background.height;
        const screenRatio = Main.screenSize.width / Main.screenSize.height;

        if (bgRatio > screenRatio) {
            this.background.height = Main.screenSize.height;
            this.background.width = this.background.height * bgRatio;
        }

        if (bgRatio < screenRatio) {
            this.background.width = Main.screenSize.width;
            this.background.height = this.background.width / bgRatio;
        }
    }

    private resizeLogo(): void {
        if (this.logo === null) return;

        const logoRatio = this.logo.width / this.logo.height;

        this.logo.height = Main.screenSize.height * 0.3;
        this.logo.width = this.logo.height * logoRatio;

        if (this.logo.width > Main.screenSize.width) {
            this.logo.width = Main.screenSize.width - 50;
            this.logo.height = this.logo.width / logoRatio;
        }
    }

    public blur(): void {
        this.filters = [this.blurFilter];
    }

    public unblur(): void {
        Animations.background.unblur(this);
    }

    private centralize(): void {
        if (this.background === null) return;
        if (this.logo === null) return;

        this.background.position.x = Main.screenSize.width / 2;
        this.background.position.y = Main.screenSize.height / 2;

        this.logo.position.x = Main.screenSize.width / 2;
        this.logo.position.y = Main.screenSize.height * 0.4;
    }

    public onResize(): void {
        this.resize();
    }
}