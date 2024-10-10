import { Container, Rectangle, Sprite } from "pixi.js";
import { Main } from "../../main";
import { IScene } from "../../data/types";
import { Animations } from "../styles/Animations";
import { SOUNDS } from "../../data/constants";

export class InitialScene extends Container implements IScene<void> {
    private logo: Sprite | null = null;

    constructor() {
        super();
        this.init();
    }

    private init(): void{
        this.hitArea = new Rectangle(0,0, Main.screenSize.width, Main.screenSize.height);
        this.eventMode ='static';
        this.on('pointerdown', this.onStartClick);
        this.cursor = "pointer";
        this.setLogo();
    }

    private setLogo(): void {
        this.logo = Main.assetsController.getSprite('initialLogo');
        this.logo.position.set(Main.screenSize.width / 2, Main.screenSize.height/2);
        if (Main.screenSize.width < this.logo.width) {
            this.logo.scale.set(Main.screenSize.width/1200)
        } 
        this.logo.anchor.set(0.5);
        Animations.initialLogo.scale(this.logo);
        this.addChild(this.logo);
    }

    private onStartClick() {
        this.playSound(SOUNDS.welcome);
        this.playBackgroundMusic();
        this.eventMode = 'none';
        Main.signalsController.round.start.emit();
    }

    private playSound(soundID: string) {
        const sound = Main.assetsController.getSound(soundID);
        sound.play();
    }

    private playBackgroundMusic(){
        const music = Main.assetsController.getSound(SOUNDS.backgroundMusic);
        music.loop(true);
        music.volume(0.1);
        music.play();
    }

    public onResize(): void {
        if (!this.logo) return
        this.logo.position.set(Main.screenSize.width / 2, Main.screenSize.height/2);
    }

    public async deactivate(): Promise<void> {
        this.logo && await Animations.initialLogo.remove(this.logo);
        this.logo && Animations.killAllAnimations(this.logo)
        this.parent.removeChild(this);
    }
}