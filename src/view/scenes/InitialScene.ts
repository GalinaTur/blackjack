import { Container, Sprite } from "pixi.js";
import { Main } from "../../main";
import { Button } from "./sceneComponents/Button";
import { IScene } from "../../data/types";
import { Animations } from "../styles/Animations";

export class InitialScene extends Container implements IScene<void> {
    private logo: Sprite | null = null;
    private button = new Button("Let's play!", this.onStartClick, true);

    constructor() {
        super();
        this.init();
    }

    private init(): void{
        this.setLogo();
        this.setButton();
    }

    private async setLogo(): Promise<void> {
        this.logo = await Main.assetsLoader.getSprite('initialLogo');
        this.logo.position.set(Main.screenSize.width / 2, Main.screenSize.height * 0.4);
        this.logo.anchor.set(0.5);
        this.addChild(this.logo);
        Animations.initialLogo.scale(this.logo);
    }

    private setButton(): void {
        this.addChild(this.button);
        this.button.position.set(Main.screenSize.width / 2, Main.screenSize.height * 0.85);
    }

    private onStartClick(): void {
        Main.signalController.round.start.emit();
    }

    public onUpdate() {

    }

    public onResize(): void {

    }
}