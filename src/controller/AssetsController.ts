import { Assets, Sprite, extensions } from "pixi.js";
import { ASSETS_MANIFEST, SOUNDS } from "../data/assets";
import {Howl} from "howler";
import { Main } from "../main";

export class AssetsLoader {
    public async init() {
        await Assets.init({ manifest: ASSETS_MANIFEST });
        await Assets.loadBundle('fonts');
        await Assets.loadBundle('initialAssets');
        await Assets.loadBundle('buttons');
        await Assets.loadBundle('labels');
        await Assets.loadBundle('other');
        await Assets.load('./assets/cards/cardsSpritesheet.json');
        await Assets.load('./assets/chips/chipsSpritesheet.json');

        this.setEventListeners();
    };

    private setEventListeners() {
        Main.signalController.sounds.isOn.add((isSoundsOn)=>Howler.mute(!isSoundsOn), this);
    }

    public async getSprite(id: string): Promise<Sprite> {
        const texture = await Assets.get(id);
        return new Sprite(texture);
    }

    public async getSound(id:string) {
        const sound = new Howl({
            src: [SOUNDS[id as keyof typeof SOUNDS]]
        });
        return sound;
    }
}