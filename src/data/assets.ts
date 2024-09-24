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
                    srcs: './assets/background.png',
                },
                {
                    name: 'bgLogo',
                    srcs: './assets/bgLogo.png',
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
            ],
        },
        {
            name: 'labels',
            assets: [
                {
                    name: 'points_label',
                    srcs: './assets/label.png',
                },
                {
                    name: 'BJ_label',
                    srcs: './assets/BJLabel.png',
                },
                {
                    name: 'regular_label',
                    srcs: './assets/regularLabel.png',
                },
                {
                    name: 'win_label',
                    srcs: './assets/winLabel.png',
                },
                {
                    name: 'final_label',
                    srcs: './assets/finalLabel.png',
                },
                {
                    name: 'shine',
                    srcs: './assets/shine.png',
                },
                {
                    name: 'finalLabel',
                    srcs: './assets/finalLabel.png',
                },
            ],
        },
        {
            name: 'other',
            assets: [
                {
                    name: 'cardsShoe',
                    srcs: './assets/shoe.png',
                },
                {
                    name: 'cardsShoePart',
                    srcs: './assets/shoePart.png',
                },
                {
                    name: 'pointer',
                    srcs: './assets/pointer.png',
                },
                {
                    name: 'pointerShine',
                    srcs: './assets/pointerShine.png',
                },
                {
                    name: 'soundsOn',
                    srcs: './assets/sounds-on.svg',
                },
                {
                    name: 'soundsOff',
                    srcs: './assets/sounds-off.svg',
                },
            ],
        },
    ],
}

export const SOUNDS = {
    welcome: './assets/sounds/welcome.wav',
    backgroundMusic: './assets/sounds/background.mp3',
    dealCard: './assets/sounds/dealCard.ogg',
    slideCard: './assets/sounds/slideCard.wav',
    flipCard: './assets/sounds/flipCard.wav',
    firstChipPlace: './assets/sounds/firstChipPlace.mp3',
    chipPlace: './assets/sounds/chipPlace.wav',
    button: './assets/sounds/button.wav',
    dealerBlackjack: './assets/sounds/dealerBlackjack.wav',
    playerBlackjack: './assets/sounds/playerBlackjack.wav',
    win: './assets/sounds/win.wav',
    push: './assets/sounds/push.wav',
    tooMany: './assets/sounds/tooMany.mp3',
    lose: './assets/sounds/lose.wav',
    popup: './assets/sounds/popup.wav'
}