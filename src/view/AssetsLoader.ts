import { Assets} from "pixi.js";


export abstract class AssetsLoader {

    static async init() {
        const assetsManifest = {
            bundles: [
                {
                    name: 'gameTableAssets',
                    assets: [
                        {
                            name: 'background',
                            srcs: '../../../assets/blue-smooth-textured-paper-background.jpg',
                        },
                    ],
                },
            ],
        }
        
        await Assets.init({manifest: assetsManifest});


        await Assets.loadBundle('gameTableAssets');
        await Assets.load('../../../assets/cards/cardsSpritesheet.json');
        };

    static async getTexture(id: string) {
            return Assets.get(id);
    }
}