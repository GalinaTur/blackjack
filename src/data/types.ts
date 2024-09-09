import { Container } from "pixi.js";
import { ALL_BETS, RANKS, SUITS } from "./constants";
import { CardModel } from "../model/CardModel";

export type TParticipants = 'dealer' | 'player';

export type TRank = typeof RANKS[number];
export type TSuit = typeof SUITS[number];
export type TValue = `${TRank}_of_${TSuit}`;

export type TBets = typeof ALL_BETS[number];

export type TRoundResult = "playerBJ" | "dealerBJ" | "win" | "doubleWin" | "lose"
    | "push" | "pushBJ" | "playerBust" | "dealerBust"
    | "surrender" | "insurance" 

export type TPanels = 'betPanel' | 'gamePanel' | 'finalPanel';
export interface IScene<T> extends Container {
    onResize(): void,
    // onUpdate(data: IStateInfo): void,
}

export interface IPanel extends Container {
    deactivate(): void
}

export interface IStateInfo {
    availableBets: TBets[];
    bet: number,
    win: number,
    currentState: ERoundState,
    cards: ICardsDealed,
    isSplitAllowed: boolean,
    roundResult: TRoundResult | null,
}

export interface ICardsDealed {
    dealer: CardModel[],
    player: CardModel[],
    split: CardModel[]
}

export interface IPoints {
    dealer: number,
    player: number,
}


export enum ERoundState {
    NOT_STARTED,
    BETTING,
    CARDS_DEALING,
    PLAYERS_TURN,
    DEALERS_TURN,
    ROUND_OVER
}

export enum EChips {
    '1$' = 'chipWhite',
    '5$' = 'chipRed',
    '10$' = 'chipOrange',
    '25$' = 'chipGreen',
    '100$' = 'chipBlack',
    '500$' = 'chipPurple',
    '1000$' = 'chipYellow',
    '5000$' = 'chipBlue',
}

export enum ERankPoints {
    'two' = 2,
    'three' = 3,
    'four' = 4,
    'five' = 5,
    'six' = 6,
    'seven' = 7,
    'eight' = 8,
    'nine' = 9,
    'ten' = 10,
    'jack' = 10,
    'queen' = 10,
    'king' = 10,
    'ace' = 1 | 11,
}