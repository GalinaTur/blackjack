import { IRoundResult, TBets, TParticipants, TResult } from "../data/types";
import { CardModel } from "../model/CardModel";
import { IStateInfo } from "../data/types";

class Signal<T = void>  {
    private subscribers: { func: ((data: T) => void), ctx: unknown }[] = [];

    public add(func: ((data: T) => void), ctx: unknown) {
        this.subscribers.push({ func, ctx });
    }

    public addPriority(func: ((data: T) => void), ctx: unknown) {
        this.subscribers.unshift({ func, ctx });
    }

    public async emit(data: T): Promise<void> {
        for (const subscriber of this.subscribers) {
            await subscriber.func.call(subscriber.ctx, data);
        }
    }

    public remove(func: ((data: T) => void)) {
        this.subscribers = this.subscribers.filter((e) => {
            return e.func !== func
        })
    }
}

export class SignalsController {
    public round = {
        start: new Signal<void>(),
        end: new Signal<IRoundResult>(),
        new: new Signal<void>(),
    }

    public bet = {
        added: new Signal<TBets>(),
        updated: new Signal<{betsStack: TBets[], sum:number, availableBets?: TBets[], isDoubleBetAllowed?: boolean}>(),
        removedLast: new Signal<void>(),
        placed: new Signal<void>(),
        cleared: new Signal<void>(),
        rebet: new Signal<void>(),
        doubled: new Signal<void >(),
    }

    public balance = {
        updated: new Signal<number>(),
    }
    
    public winSize = {
        updated: new Signal<{win: number, totalWin: number}>(),
    }

    public card = {
        deal: new Signal<{ person: TParticipants, card: CardModel, totalPoints: number, resolve: (value: unknown)=>void }>(),
        open: new Signal<{ card: CardModel, totalPoints: number, resolve: (value: unknown)=>void }>(),
    }

    public player = {
        hit: new Signal<void>(),
        stand: new Signal<void>(),
        double: new Signal<void>(),
        split: new Signal<void>(),
        insure: new Signal<void>(),
        endTurn: new Signal<IRoundResult>(),
    }

    public dealer = {
        hit: new Signal<void>(),
        stand: new Signal<void>(),
    }

}