import { Container } from "pixi.js";
import { ALL_BETS, RANKS, SUITS } from "./constants";
import { CardModel } from "../model/CardModel";

export type TParticipants = 'dealer' | 'player' | 'split';

export type TRank = typeof RANKS[number];
export type TSuit = typeof SUITS[number];
export type TValue = `${TRank}_of_${TSuit}`;

export type TBets = typeof ALL_BETS[number];

export type TResult = "playerBJ" | "dealerBJ" | "win" | "doubleWin" | "lose"
    | "push" | "pushBJ" | "playerBust" | "dealerBust"
    | "surrender" | "insurance" 

export type TPanels = 'betPanel' | 'gamePanel' | 'finalPanel';
export interface IScene<T> extends Container {
    onResize(): void,
    deactivate(): Promise<void> | void,
}

export interface IButton {
    text: string,
    imgID: string
}

export interface IRoundResult {
    main: TResult | null,
    split: TResult | null
}

export interface IPanel extends Container {
    deactivate(): void;
    onResize(): void;
}

export interface IRoundStateDTO {
    availableBets: TBets[],
    bet: number,
    win: number,
    currentState: ERoundState,
    cards: ICardsDealed,
    isSplitAllowed: boolean,
    roundResult: IRoundResult
}

export interface ICardsDealed {
    dealer: readonly CardModel[],
    main: readonly CardModel[],
    split?: readonly CardModel[] | null
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
    SPLIT_TURN,
    DEALERS_TURN,
    ROUND_OVER
}

export enum EChips {
    '1$' = 'brownChip',
    '5$' = 'greenChip',
    '25$' = 'blueChip',
    '100$' = 'purpleChip',
    '500$' = 'redChip',
    '2000$' = 'blackChip',
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