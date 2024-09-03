import { RANKS, SUITS } from "./constants";

export type TParticipants = 'dealer' | 'player';

export type TRank = typeof RANKS[number];
export type TSuit = typeof SUITS[number];