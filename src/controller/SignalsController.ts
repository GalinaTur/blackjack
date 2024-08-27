class Signal<T = void> {
    subscribers: ((data: T) => void)[] = [];

    add(func: ((data: T) => void), ctx: unknown) {
        this.subscribers.push(func.bind(ctx));
    }

    emit(data: T) {
        this.subscribers.forEach(func => func(data));
    }
    
    remove() {

    }
}

export class SignalsController {
    roundStart: Signal<void> = new Signal();
    
    bet = {
        added: new Signal<number>(),
        updated: new Signal<number>(),
        removed: new Signal<number>(),
        placed: new Signal(),
        cleared: new Signal(),
    }

    card = {
        deal: new Signal(),
        open: new Signal(),
    }

    player = {
            hit: new Signal(),
            stand: new Signal(),
            double: new Signal(),
            split: new Signal(),
            insure: new Signal(),
        }
    
    dealer = {
        hit: new Signal(),
        stand: new Signal(),
    }
}