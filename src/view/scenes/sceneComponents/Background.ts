import { Container, Sprite } from "pixi.js";
import { Main } from "../../../main";


export class Background extends Container {
    private image: Sprite | null = null;
    private logo: Sprite | null = null;

    constructor() {
        super();
        this.setBgImage()
        .then(this.setLogoImage.bind(this))
        .then(this.resize.bind(this))
        .then(this.centralize.bind(this));
    }

    private async setBgImage() {
        this.image = await Main.assetsLoader.getSprite('background');
        this.image.anchor.set(0.5);
        this.addChild(this.image);
    }
    
    private async setLogoImage() {
        this.logo = await Main.assetsLoader.getSprite('bgLogo');
        if (this.logo === null) return;
        this.logo.anchor.set(0.5, 1);
        this.addChild(this.logo);
    }

    private resize() {
        if (this.image === null) return;
        if (this.logo === null) return;
        const bgRatio = this.image.height/this.image.width;
        const screenRatio = Main.screenSize.height/Main.screenSize.width;
        
        if (bgRatio < screenRatio) {
            this.image.height = Main.screenSize.height;
            this.image.width = this.image.height/bgRatio;
        } 

        if (bgRatio > screenRatio) {
            this.image.width = Main.screenSize.width;
            this.image.height = this.image.width*bgRatio;
        }

        this.logo.width = Main.screenSize.width*0.8
        this.logo.height = this.logo.width
    }

    private centralize(){
        if (this.image === null) return;
        if (this.logo === null) return;
        this.image.position.x = Main.screenSize.width/2;
        this.image.position.y = Main.screenSize.height/2;

        this.logo.position.x = Main.screenSize.width/2;
        this.logo.position.y = Main.screenSize.height*0.5;
    }

    private onResize() {
        this.resize();
        this.centralize();
    }
}