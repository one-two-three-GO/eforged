
export interface IErrorListenerCallback {
    (error: any): void;
}

export interface IErrorListenerUnbind {
    (): void;
}

// Avoid circular dependency on EventEmitter by implementing a subset of the interface.
export class ErrorHandler {
    private unexpectedErrorHandler: (error: any) => void;
    private listeners: IErrorListenerCallback[];

    constructor() {

        this.listeners = [];

        this.unexpectedErrorHandler = (error: any) => {
            setTimeout(() => {
                if (error.stack) {
                    throw new Error(error.message + '\n\n' + error.stack);
                }

                throw error;
            }, 0);
        };
    }

    public addListener(listener: IErrorListenerCallback): IErrorListenerUnbind {
        this.listeners.push(listener);

        return () => {
            this._removeListener(listener);
        };
    }

    public setUnexpectedErrorHandler(newUnexpectedErrorHandler: (error: any) => void): void {
        this.unexpectedErrorHandler = newUnexpectedErrorHandler;
    }

    public getUnexpectedErrorHandler(): (error: any) => void {
        return this.unexpectedErrorHandler;
    }

    public onUnexpectedError(error: any): void {
        this.unexpectedErrorHandler(error);
        this.emit(error);
    }

    // For external errors, we don't want the listeners to be called
    public onUnexpectedExternalError(error: any): void {
        this.unexpectedErrorHandler(error);
    }

    private emit(error: any): void {
        for (const listener of this.listeners) {
            listener(error);
        }
    }

    private _removeListener(listener: IErrorListenerCallback): void {
        this.listeners.splice(this.listeners.indexOf(listener), 1);
    }
}

export const errorHandler = new ErrorHandler();
