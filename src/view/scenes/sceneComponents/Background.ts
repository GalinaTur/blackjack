import { Container, Sprite } from "pixi.js";
import { Main } from "../../../main";

export class Background extends Container {
    private background: Sprite | null = null;
    private logo: Sprite | null = null;

    constructor() {
        super();
        this.setBgbackground()
            .then(this.setLogobackground.bind(this))
            .then(this.resize.bind(this))
            .then(this.centralize.bind(this));
    }

    private async setBgbackground() {
        this.background = await Main.assetsLoader.getSprite('background');
        this.background.anchor.set(0.5);
        this.addChild(this.background);
    }

    private async setLogobackground() {
        this.logo = await Main.assetsLoader.getSprite('bgLogo');
        if (this.logo === null) return;
        this.logo.anchor.set(0.5, 1);
        this.addChild(this.logo);
    }

    private resize() {
        if (this.background === null) return;
        if (this.logo === null) return;
        const bgRatio = this.background.height / this.background.width;
        const screenRatio = Main.screenSize.height / Main.screenSize.width;

        if (bgRatio < screenRatio) {
            this.background.height = Main.screenSize.height;
            this.background.width = this.background.height / bgRatio;
        }

        if (bgRatio > screenRatio) {
            this.background.width = Main.screenSize.width;
            this.background.height = this.background.width * bgRatio;
        }

        this.logo.width = Main.screenSize.width * 0.8
        this.logo.height = this.logo.width
    }

    private centralize() {
        if (this.background === null) return;
        if (this.logo === null) return;
        this.background.position.x = Main.screenSize.width / 2;
        this.background.position.y = Main.screenSize.height / 2;

        this.logo.position.x = Main.screenSize.width / 2;
        this.logo.position.y = Main.screenSize.height * 0.5;
    }

    private onResize() {
        this.resize();
        this.centralize();
    }
}