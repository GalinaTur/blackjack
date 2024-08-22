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
}