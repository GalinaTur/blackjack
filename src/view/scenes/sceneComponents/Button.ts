import { Application, ColorMatrixFilter, Container, DisplayObject, Filter, filters, Sprite, Spritesheet, SpriteSource, Text, TextStyle } from "pixi.js";
import { AssetsLoader } from "../../../controller/AssetsController";
import { Main } from "../../../main";


export class Button extends Container {
    image: Sprite | null = null;
    text: Text | null = null;
    // sepiaColorFilter: ColorMatrixFilter

    constructor(buttonText: string | null, onClick: (()=>void)) {
        super();
        this.setSprite().then(() =>
            this.setText(buttonText));
        this.eventMode = "static";
        this.cursor = "pointer";
        // this.sepiaColorFilter = new ColorMatrixFilter();
        // this.sepiaColorFilter.sepia(true);
        // this.filters = [this.sepiaColorFilter];

        this.on('click', onClick);
    }
    
    async setSprite() {
        this.image = await AssetsLoader.getSprite('button');
        this.image.anchor.set(0.5);
        this.setSize();
        this.addChild(this.image);
    }

    setText(data: string | null) {
        if (!data) return
        if (!this.image) return;

        const style = new TextStyle({

            fontSize: 36,
            fill: "#ffffff",
            fontFamily: "SairaBD",
            strokeThickness: 4,
        });

        this.text = new Text(data, style);
        this.text.anchor.set(0.5);
        this.addChild(this.text);
    }

    async setSize() {
        if (this.image === null) return;
        const buttonRatio = this.image.height / this.image.width;

        // this.image.width = Main.screenSize.width * 0.1;
        // this.image.height = this.image.width * buttonRatio;
    }

    // enable() {
    //     this.button.alpha = 1;
    //     this.container.filters = [this.glowFilter];
    //     this.container.eventMode = "static";
    //     this.container.cursor = "pointer";
    // }

    // disable() {
    //     if (this.button.alpha === 1) {
    //         this.container.eventMode = "auto";
    //         this.container.cursor = "default";
    //         this.container.filters = [this.sepiaColorFilter, this.glowFilter, ...this.additionalFilters];
    //         this.button.alpha = 0.5;
    //     }
    // }
}