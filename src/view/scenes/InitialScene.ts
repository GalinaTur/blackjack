import { Container, Sprite } from "pixi.js";
import { Main } from "../../main";
import { Button } from "./sceneComponents/Button";
import { IScene } from "../GameView";

export class InitialScene extends Container implements IScene<void> {
    logo: Sprite | null = null;
    button = new Button("Let's play!", this.onStartClick, true);

    constructor() {
        super();
        this.init();
    }

    private init() {
        this.setLogo();
        this.setButton();
    }

    async setLogo() {
        this.logo = await Main.assetsLoader.getSprite('initialLogo');
        this.logo.position.set(Main.screenSize.width / 2, Main.screenSize.height*0.4);
        this.logo.anchor.set(0.5);
        this.addChild(this.logo);
    }

    setButton() {
        this.addChild(this.button);
        this.button.position.set(Main.screenSize.width / 2, Main.screenSize.height*0.85);
    }

    onStartClick() {
        Main.signalController.round.start.emit();
    }

    onUpdate() {

    }

    onResize(): void {
        
    }
}