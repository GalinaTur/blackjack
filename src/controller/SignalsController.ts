import { TParticipants } from "../data/types";
import { CardModel } from "../model/CardModel";
import { IStateInfo, TRoundResult } from "../model/RoundModel";

class Signal<T = void> {
    private subscribers: { func: ((data: T) => void), ctx: unknown }[] = [];

    public add(func: ((data: T) => void), ctx: unknown) {
        this.subscribers.push({ func, ctx });
    }

    public emit(data: T) {
        this.subscribers.forEach(sub => sub.func.call(sub.ctx, data));
    }

    public remove(func: ((data: T) => void)) {
        this.subscribers = this.subscribers.filter((e) => {
            return e.func !== func
        })
    }
}

export class SignalsController {

    public round = {
        changeState: new Signal<IStateInfo>(),
        start: new Signal<void>(),
        end: new Signal<TRoundResult>(),
        new: new Signal<void>(),
    }

    public bet = {
        added: new Signal<number>(),
        updated: new Signal<number>(),
        removed: new Signal<number>(),
        placed: new Signal<void>(),
        cleared: new Signal<void>(),
        rebet: new Signal<void>(),
    }

    public card = {
        deal: new Signal<{ person: TParticipants, card: CardModel, totalPoints: number }>(),
        open: new Signal<{ card: CardModel, totalPoints: number }>(),
    }

    public player = {
        hit: new Signal<void>(),
        stand: new Signal<void>(),
        double: new Signal<void>(),
        split: new Signal<void>(),
        insure: new Signal<void>(),
    }

    public dealer = {
        hit: new Signal<void>(),
        stand: new Signal<void>(),
    }

}