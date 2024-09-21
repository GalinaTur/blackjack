import { Assets, Sprite } from "pixi.js";
import { ASSETS_MANIFEST } from "../data/assets";

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
    };

    public async getSprite(id: string): Promise<Sprite> {
        const texture = await Assets.get(id);
        return new Sprite(texture);
    }
}