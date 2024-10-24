export const ASSETS_MANIFEST = {
    bundles: [
        {
            name: 'fonts',
            assets: [
                {
                    name: 'Saira',
                    srcs: './assets/fonts/Saira-Regular.ttf',
                    data: { family: 'Saira' },
                },
                {
                    name: 'SairaBlackItalic',
                    srcs: './assets/fonts/Saira-BlackItalic.ttf',
                    data: { family: 'SairaBlackItalic' },
                },
                {
                    name: 'SairaLightItalic',
                    srcs: './assets/fonts/Saira-LightItalic.ttf',
                    data: { family: 'SairaLightItalic' },
                },
            ],
        },
        {
            name: 'initialAssets',
            assets: [
                {
                    name: 'initialLogo',
                    srcs: './assets/initialLogo.png',
                },
                {
                    name: 'background',
                    srcs: './assets/gameTable/background.png',
                },
                {
                    name: 'bgLogo',
                    srcs: './assets/gameTable/bgLogo.png',
                },
            ],
        },
        {
            name: 'buttons',
            assets: [
                {
                    name: 'clearBet',
                    srcs: './assets/buttons/clearBet.png',
                },
                {
                    name: 'deal',
                    srcs: './assets/buttons/deal.png',
                },
                {
                    name: 'double',
                    srcs: './assets/buttons/double.png',
                },
                {
                    name: 'doubleBet',
                    srcs: './assets/buttons/doubleBet.png',
                },
                {
                    name: 'hit',
                    srcs: './assets/buttons/hit.png',
                },
                {
                    name: 'stand',
                    srcs: './assets/buttons/stand.png',
                },
                {
                    name: 'insurance',
                    srcs: './assets/buttons/insurance.png',
                },
                {
                    name: 'noInsurance',
                    srcs: './assets/buttons/noInsurance.png',
                },
                {
                    name: 'split',
                    srcs: './assets/buttons/split.png',
                },
                {
                    name: 'undo',
                    srcs: './assets/buttons/undo.png',
                },
                {
                    name: 'repeat',
                    srcs: './assets/buttons/repeat.png',
                },
                {
                    name: 'topUp',
                    srcs: './assets/buttons/topUp.png',
                },
                {
                    name: 'soundsOn',
                    srcs: './assets/buttons/sounds-on.svg',
                },
                {
                    name: 'soundsOff',
                    srcs: './assets/buttons/sounds-off.svg',
                },
                {
                    name: 'info',
                    srcs: './assets/buttons/info.svg',
                },
                {
                    name: 'next',
                    srcs: './assets/buttons/next.svg',
                },
                {
                    name: 'previous',
                    srcs: './assets/buttons/previous.svg',
                },
                {
                    name: 'closeInfo',
                    srcs: './assets/buttons/close-info.svg',
                },
            ],
        },
        {
            name: 'labels',
            assets: [
                {
                    name: 'points_label',
                    srcs: './assets/labels/label.png',
                },
                {
                    name: 'BJ_label',
                    srcs: './assets/labels/BJLabel.png',
                },
                {
                    name: 'regular_label',
                    srcs: './assets/labels/regularLabel.png',
                },
                {
                    name: 'win_label',
                    srcs: './assets/labels/winLabel.png',
                },
                {
                    name: 'final_label',
                    srcs: './assets/labels/finalLabel.png',
                },
                {
                    name: 'shine',
                    srcs: './assets/labels/shine.png',
                },
                {
                    name: 'finalLabel',
                    srcs: './assets/labels/finalLabel.png',
                },
            ],
        },
        {
            name: 'other',
            assets: [
                {
                    name: 'cardsShoe',
                    srcs: './assets/gameTable/shoe.png',
                },
                {
                    name: 'cardsShoePart',
                    srcs: './assets/gameTable/shoePart.png',
                },
                {
                    name: 'pointer',
                    srcs: './assets/pointer.png',
                },
                {
                    name: 'pointerShine',
                    srcs: './assets/pointerShine.png',
                },
            ],
        },
    ],
}

export const SOUNDS = {
    welcome: './assets/sounds/welcome.mp3',
    backgroundMusic: './assets/sounds/background.mp3',
    dealCard: './assets/sounds/dealCard.mp3',
    slideCard: './assets/sounds/slideCard.mp3',
    flipCard: './assets/sounds/flipCard.mp3',
    firstChipPlace: './assets/sounds/firstChipPlace.mp3',
    chipPlace: './assets/sounds/chipPlace.mp3',
    button: './assets/sounds/button.mp3',
    dealerBJ:'./assets/sounds/dealerBJ.mp3',
    playerBJ:'./assets/sounds/playerBJ.mp3',
    hit: './assets/sounds/hit.mp3',
    stand: './assets/sounds/stand.mp3',
    split: './assets/sounds/split.mp3',
    doubledown: './assets/sounds/doubledown.mp3',
    win: './assets/sounds/win.mp3',
    push: './assets/sounds/push.mp3',
    tooMany: './assets/sounds/tooMany.mp3',
    lose: './assets/sounds/lose.mp3',
    popup: './assets/sounds/popup.mp3'
}