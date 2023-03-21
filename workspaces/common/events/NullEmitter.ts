import { Emitter } from './Emitter';
import { Handler } from "./Handler";


export class NullEmitter<TEventArgs = void> extends Emitter<TEventArgs> {

    public emit(): Emitter<TEventArgs> {
        return this;
    }

    public subscribe(handler: Handler): Emitter<TEventArgs> {
        return this;
    }

    public unsubscribe(handler?: Handler): void {
        // no-op
    }

    public clear(): void {
        // no-op
    }

    public static getInstance<TArgs>(): NullEmitter<TArgs> {
        return new NullEmitter<TArgs>();
    }
}
