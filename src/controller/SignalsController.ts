import { TRoundResult } from "../model/RoundModel";
import { TParticipants } from "./RoundController";

class Signal<T = void> {
    private subscribers: ((data: T) => void)[] = [];

    public add(func: ((data: T) => void), ctx: unknown) {
        this.subscribers.push(func.bind(ctx));
    }

    public emit(data: T) {
        this.subscribers.forEach(func => func(data));
    }
    
    public remove() {

    }
}

export class SignalsController {
    
    public round = {
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
    }

    public card = {
        deal: new Signal<TParticipants>(),
        open: new Signal<void>(),
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