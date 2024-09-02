import { Assets, Sprite } from "pixi.js";

export class AssetsLoader {
    public async init() {
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
                    ],
                },
                {
                    name: 'labels',
                    assets: [
                        {
                            name: 'points_label',
                            srcs: '../../../assets/label.png',
                        },
                        {
                            name: 'BJ_label',
                            srcs: '../../../assets/BJLabel.png',
                        },
                        {
                            name: 'regular_label',
                            srcs: '../../../assets/regularLabel.png',
                        },
                        {
                            name: 'win_label',
                            srcs: '../../../assets/winLabel.png',
                        },
                        {
                            name: 'final_label',
                            srcs: '../../../assets/finalLabel.png',
                        },
                        {
                            name: 'shine',
                            srcs: '../../../assets/shine.png',
                        },
                    ],
                },
            ],
        }

        await Assets.init({ manifest: assetsManifest });
        await Assets.loadBundle('fonts');
        await Assets.loadBundle('initialAssets');
        await Assets.loadBundle('gameTableAssets');
        await Assets.loadBundle('labels');
        await Assets.load('../../../assets/cards/cardsSpritesheet.json');
        await Assets.load('../../../assets/chips/chipsSpritesheet.json');
    };

    public async getSprite(id: string): Promise<Sprite> {
        const texture = await Assets.get(id);
        return new Sprite(texture);
    }
}