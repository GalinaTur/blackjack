export const ALL_BETS = [1, 5, 25, 100, 500, 2000] as const;

export const RANKS = ['two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'jack', 'queen', 'king', 'ace'] as const;
export const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'] as const;

export const SCENES = ['InitialScene', 'GameScene'] as const;
export const HEADER_FIELDS = {
    bet: 'Bet',
    balance: 'Balance',
    win: 'Win',
    totalWin: 'Total Win'
};

export const BUTTONS = {
    bet: {
        clear: {
            text: 'Clear',
            imgID: 'clearBet',
        },
        double: {
            text: 'Double',
            imgID: 'doubleBet',
        },
        undo: {
            text: 'Undo',
            imgID: 'undo',
        },
        deal: {
            text: 'Deal',
            imgID: 'deal',
        }
    },
    game: {
        hit: {
            text: 'Hit',
            imgID: 'hit',
        },
        stand: {
            text: 'Stand',
            imgID:'stand',
        },
        doubleDown: {
            text: 'Double',
            imgID: 'double',
        },
        split: {
            text: 'Split',
            imgID:'split',
        },
        insure: {
            text: 'Insure',
            imgID: 'insurance',
        },
        noInsure: {
            text: 'No Insure',
            imgID: 'noInsurance',
        }
    },
    final:{
        repeat: {
            text: 'Repeat',
            imgID: 'repeat',
        },
        topUp: {
            text: 'Top Up',
            imgID: 'topUp',
        },
    },
    footer:{
        soundsOn: {
            text: '',
            imgID: 'soundsOn',
        },
        soundsOff: {
            text: '',
            imgID: 'soundsOff',
        },
        info: {
            text: '',
            imgID: 'info',
        },
        next: {
            text: '',
            imgID: 'next',
        },
        previous: {
            text: '',
            imgID: 'previous',
        },
        closeInfo: {
            text: '',
            imgID: 'closeInfo',
        },
    }
}

export const SOUNDS = {
    welcome: 'welcome',
    backgroundMusic: 'backgroundMusic',
    dealCard: 'dealCard',
    slideCard: 'slideCard',
    flipCard: 'flipCard',
    firstChipPlace: 'firstChipPlace',
    chipPlace: 'chipPlace',
    button: 'button',
    dealerBJ: 'dealerBJ',
    playerBJ: 'playerBJ',
    hit: 'hit',
    stand: 'stand',
    split: 'split',
    doubledown: 'doubledown',
    win: 'win',
    push: 'push',
    tooMany: 'tooMany',
    lose:'lose',
    popup:'popup'
}