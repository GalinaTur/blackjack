import { Assets, Sprite } from "pixi.js";
import { ASSETS_MANIFEST, SOUNDS } from "../data/assets";
import { Howl } from "howler";

export class AssetsController {
    public async init(): Promise<void> {
        await Assets.init({ manifest: ASSETS_MANIFEST });
        await Assets.loadBundle('fonts');
        await Assets.loadBundle('initialAssets');
        await Assets.loadBundle('buttons');
        await Assets.loadBundle('labels');
        await Assets.loadBundle('other');
        await Assets.load('./assets/cards/cardsSpritesheet.json');
        await Assets.load('./assets/chips/chipsSpritesheet.json');

        Object.values(this.soundsStorage).forEach((howl) => howl.load());
    };


    private soundsStorage: { [key: string]: Howl } = {
        welcome: new Howl({
            src: [SOUNDS.welcome],
            preload: true,
        }),
        backgroundMusic: new Howl({
            src: [SOUNDS.backgroundMusic],
            preload: true,
            loop: true,
        }),
    }

    public getSprite(id: string): Sprite {
        const texture = Assets.get(id);
        return new Sprite(texture);
    }

    public getSound(id: string): Howl {
        if (this.soundsStorage[id]) {
            return this.soundsStorage[id];
        }
        const sound = new Howl({
            src: [SOUNDS[id as keyof typeof SOUNDS]]
        });
        return sound;
    }
}