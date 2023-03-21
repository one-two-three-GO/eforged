import { NOOP } from '../apis';
import { IDisposable } from '../lifecycle';
import { Handler } from './Handler';

export class EventHandler<TEventArgs = any> implements IDisposable {
    private _wrapped: Handler<TEventArgs> = NOOP;
    private _isDisposed = false;

    public get isDisposed(): boolean { return this._isDisposed; }

    constructor(handler: Handler) {
        this._wrapped = handler;
    }

    public dispose(): void {
        if (this._isDisposed) {
            return;
        }

        this._wrapped = undefined;
        this._isDisposed = true;
    }

    public emit(args: TEventArgs): void {
        if (this.handler) {
            this.handler.call(args);
        }
    }

    public get handler(): Handler<TEventArgs> {
        return this._wrapped;
    }
}

export function isEventHandler(object: unknown): object is EventHandler {
    const obj = object as EventHandler;
    if (obj === undefined) return false;
    if (obj.dispose === undefined) return false;
    if (obj.emit === undefined) return false;
    return (obj.handler !== undefined);
}