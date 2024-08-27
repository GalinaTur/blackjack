import { Assets, Sprite} from "pixi.js";


export class AssetsLoader {

    async init() {
        const assetsManifest = {
            bundles: [
                {
                    name: 'fonts',
                    assets: [
                        {
                            name: 'Saira',
                            srcs: '../../../assets/fonts/Saira-Regular.ttf',
                            data: { family: 'Saira' },
                        },
                        {
                            name: 'SairaBD',
                            srcs: '../../../assets/fonts/Saira-BlackItalic.ttf',
                            data: { family: 'SairaBD' },
                        },
                    ],
                },
                {
                    name: 'initialAssets',
                    assets: [
                        {
                            name: 'initialLogo',
                            srcs: '../../../assets/initialLogo.png',
                        },
                        {
                            name: 'background',
                            srcs: '../../../assets/background.jpg',
                        },
                        {
                            name: 'bgLogo',
                            srcs: '../../../assets/bgLogo.png',
                        },
                        {
                            name: 'button',
                            srcs: '../../../assets/button.png',
                        },
                    ],
                },
                {
                    name: 'gameTableAssets',
                    assets: [
                        {
                            name: 'header_panel',
                            srcs: '../../../assets/headerPanel.png',
                        },
                        {
                            name: 'bet_panel',
                            srcs: '../../../assets/betPanel.png',
                        },
                        {
                            name: 'game_panel',
                            srcs: '../../../assets/gamePanel.png',
                        },
                        {
                            name: 'cards_back',
                            srcs: '../../../assets/cards/cards_back.png',
                        },
                        {
                            name: 'points_label',
                            srcs: '../../../assets/label.png',
                        },
                    ],
                },
            ],
        }
        
        await Assets.init({manifest: assetsManifest});
        await Assets.loadBundle('fonts');
        await Assets.loadBundle('initialAssets');
        await Assets.loadBundle('gameTableAssets');
        await Assets.load('../../../assets/cards/cardsSpritesheet.json');
        await Assets.load('../../../assets/chips/chipsSpritesheet.json');
        };

    static async getSprite(id: string) {
        const texture = Assets.get(id);
        return new Sprite(texture);
    }
}