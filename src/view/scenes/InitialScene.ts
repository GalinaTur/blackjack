import { Container, Sprite } from "pixi.js";
import { AssetsLoader } from "../../controller/AssetsController";
import { Main } from "../../main";
import { Button } from "./sceneComponents/Button";

export class InitialScene extends Container {
    logo: Sprite | null = null;
    button = new Button("Let's play!", this.onStartClick);

    constructor() {
        super();
        this.init();
    }

    init() {
        this.setLogo();
        this.setButton();
    }

    async setLogo() {
        this.logo = await AssetsLoader.getSprite('initialLogo');
        this.logo.position.set(Main.screenSize.width / 2, Main.screenSize.height*0.4);
        this.logo.anchor.set(0.5);
        this.addChild(this.logo);
    }

    setButton() {
        this.addChild(this.button);
        this.button.position.set(Main.screenSize.width / 2, Main.screenSize.height*0.85);
    }

    onStartClick() {
        Main.signalController.roundStart.emit();
    }
}