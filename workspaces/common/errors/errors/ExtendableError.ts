// 'Error' breaks prototype chain
// see https://stackoverflow.com/questions/41102060/typescript-extending-error-class/48342359#48342359

/**> An extendable Error object which unbreaks the prototype chain. */
export class ExtendableError extends Error {

    /**> The name of the Error type. */
    public readonly name: string;

    /**> The object that is used in the lookup chain to resolve methods. */
    public readonly __proto__!: Error;

    /**> The message text to display. */
    public message = '';

    /**> The stack trace. */
    private readonly _stack: string[];

    constructor(message?: string) {
        super(); // Error breaks the prototype chain here
        this.message = message || '';
        const trueProto = new.target.prototype;

        // restore prototype chain
        if (Object.setPrototypeOf) { Object.setPrototypeOf(this, trueProto); }
        else { this.__proto__ = trueProto; }

        // set the name of the Error type from the name of the constructor that was called
        this.name = new.target.name;

        // set the stack trace (array)
        this._stack = this.calculateStackArray(new Error().stack);

        // Override the stack getter here
        // Doing it this way because creating a `getter` property
        // doesn't stop Chrome from showing the default stack
        const self = this;
        Object.defineProperty(this, 'stack', {
            get: () => self._stack.join('\n')
        });
    }

    /**
     * Takes a stack string, converts it to an array of strings (one row per line),
     * and sets the execution context (by removing the error constructors).
     */
    private calculateStackArray(stack: string | undefined): string[] {
        if (!stack) { return []; }

        const arr = stack.split('\n');

        // is the constructor in the stack trace?
        const lastIndex = this.getLastIndex(arr, this.name);

        // if the constructor isn't in the stack, then get out
        if (lastIndex === -1) { return []; }

        // remove the constructor (and any previous lines in the stack trace)!
        // NOTE: Chrome and Firefox build stack traces differently
        arr.splice(0, lastIndex + 1);
        return arr;
    }

    private getLastIndex(array: string[], text: string): number {
        // Chrome and Firefox build stack traces differently

        // find the indicies of all the elements where the text appears
        const occurrenceIndices: number[] = [];
        for (let index = 0; index < array.length; index++) {
            if (array[ index ].includes(text)) {
                occurrenceIndices.push(index);
            }
        }

        // if the text doesn't appear anywhere in the array, then return -1
        if (occurrenceIndices.length === 0) { return -1; }

        // return the index of the last element where the text appears
        const lastIndex = occurrenceIndices[ occurrenceIndices.length - 1 ];
        return lastIndex;
    }
}
