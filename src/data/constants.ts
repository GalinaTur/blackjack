export const ALL_BETS = [1, 5, 10, 25, 100, 500, 1000, 5000] as const;

export const RANKS = ['two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'jack', 'queen', 'king', 'ace'] as const;
export const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'] as const;

export const SCENES = ['InitialScene', 'GameScene'] as const;
export const HEADER_FIELDS = {
    bet: 'Bet',
    balance: 'Balance',
    win: 'Win',
    totalWin: 'Total Win'
};