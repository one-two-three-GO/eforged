// This is basically lifted from vscode.

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* eslint-disable @typescript-eslint/dot-notation */

import { MultiDisposeError } from './errors';
import { isIterable } from './types';

export interface IDisposable {
    dispose(): void;
}

export function isDisposable<E extends object>(thing: E): thing is E & IDisposable {
    return typeof (thing as IDisposable).dispose === 'function' && (thing as IDisposable).dispose.length === 0;
}

export function dispose<T extends IDisposable>(argument: T): T;
export function dispose<T extends IDisposable, A extends IterableIterator<T> = IterableIterator<T>>(disposables: IterableIterator<T>): A;
export function dispose<T extends IDisposable>(argument: T | IterableIterator<T> | undefined): any {
    if (isIterable(argument)) {
        const errors: any[] = [];

        for (const d of argument) {
            if (d) {
                // markTracked(d);
                try {
                    d.dispose();
                } catch (error) {
                    errors.push(error);
                }
            }
        }

        if (errors.length === 1) {
            throw errors[ 0 ];
        } else if (errors.length > 1) {
            throw new MultiDisposeError(errors);
        }

        return Array.isArray(argument) ? [] : argument;
    } else if (argument) {
        argument.dispose();
        return argument;
    }
}

export function toDisposable(function_: () => void): IDisposable {
    return { dispose() { function_(); } };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function using<T extends IDisposable,
    T2 extends IDisposable,
    T3 extends IDisposable>(disposable: [ T, T2, T3 ], action: (r: T, r2: T2, r3: T3) => void);
function using<T extends IDisposable, T2 extends IDisposable>(disposable: [ T, T2 ], action: (r: T, r2: T2) => void);
function using<T extends IDisposable>(disposable: T, action: (r: T) => void);
function using(disposable: IDisposable[], action: (...r: IDisposable[]) => void);
function using(disposable: IDisposable | IDisposable[], action: (...r: IDisposable[]) => void) {
    const disposableArray = Array.isArray(disposable) ? disposable : [ disposable ];
    try {
        action(...disposableArray);
    } finally {
        for (const d of disposableArray) d.dispose();
    }
}

/** A store for registering and disposing of child disposables. */
export class DisposableStore implements IDisposable {

    private _toDispose = new Set<IDisposable>();
    private _isDisposed = false;

    /**
     * Dispose of all registered disposables and mark this object as disposed.
     *
     * Any future disposables added to this object will be disposed of on `add`.
     */
    public dispose(): void {
        if (this._isDisposed) {
            return;
        }

        this._isDisposed = true;
        this.clear();
    }

    /**
     * Dispose of all registered disposables but do not mark this object as disposed.
     */
    public clear(): void {
        try {
            dispose(this._toDispose.values());
        } finally {
            this._toDispose.clear();
        }
    }

    public add<T extends IDisposable>(t: T): T {
        if (!t) {
            return t;
        }
        if ((t as unknown as DisposableStore) === this) {
            throw new Error('Cannot register a disposable on itself!');
        }

        if (!this._isDisposed) {
            this._toDispose.add(t);
        }
        return t;
    }

    public get size(): number {
        return this._toDispose.size;
    }
}

export abstract class Disposable implements IDisposable {

    static readonly None = Object.freeze<IDisposable>({ dispose() {} });

    private readonly _store = new DisposableStore();
    public get isDisposed(): boolean { return this._store[ '_toDispose' ].size === 0; }

    public dispose(): void {
        this._store.dispose();
    }

    protected _register<T extends IDisposable>(t: T): T {
        if ((t as unknown as Disposable) === this) {
            throw new Error('Cannot register a disposable on itself!');
        }
        return this._store.add(t);
    }
}
