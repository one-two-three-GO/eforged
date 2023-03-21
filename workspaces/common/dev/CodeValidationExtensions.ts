import { ArgumentNullException } from "../errors";

export class all {}

/** Must declare these methods in the global interfaces */
declare global {

    /** Public instance methods */
    interface ObjectConstructor {
        /**
         * Throws an error if the given variable is `null`.
         *
         * @param variableName The name of the variable to validate (for error logging).
         * @param variable The variable to validate.
         */
        throwIfNull(object: unknown, name: string): void;

        /**
         * Throws an error if the given variable is `undefined`.
         *
         * @param variableName The name of the variable to validate (for error logging).
         */
        throwIfUndefined(object: unknown, name: string): void;

        /**
         * Throws an error if the given variable is either `null` or `undefined`,
         * including a custom message in the error text.
         *
         * @param variableName The name of the variable to validate (for error logging).
         */
        throwIfNullOrUndefined(object: unknown, name: string): void;
    }

    /** Public instance methods */
    interface StringConstructor {
        /**
         * Throws an error if the given string-type variable is equal '' (empty string).
         *
         * @param {string} variableName The name of the variable to validate (for error logging).
         */
        throwIfEmpty(object: string, name: string): void;

        /**
         * Throws an error if the given variable is `null`.
         *
         * @param variableName The name of the variable to validate (for error logging).
         * @param variable The variable to validate.
         */
        throwIfNull(object: unknown, name: string): void;

        /**
         * Throws an error if the given variable is `undefined`.
         *
         * @param variableName The name of the variable to validate (for error logging).
         */
        throwIfUndefined(object: unknown, name: string): void;

        /**
         * Throws an error if the given variable is either `null` or `undefined`,
         * including a custom message in the error text.
         *
         * @param variableName The name of the variable to validate (for error logging).
         */
        throwIfNullOrUndefined(object: unknown, name: string): void;

        /**
         * Throws an error if the given string-type variable is `null`, `undefined`,
         * or '' (empty string), including a custom message in the error text.
         *
         * @param variableName The name of the variable to validate (for error logging).
         */
        throwIfNullUndefinedOrEmpty(object: unknown, name: string): void;
    }

    interface ArrayConstructor {

        /**
         * Verifies that the specified array exists.
         *
         * @param variableName The name of the array to validate (for error logging purposes)
         */
        validateArray(object: any[], name: string): void;

        /**
         * Verifies that the specified array exists, and has at least `minLength` entries.
         *
         * @param variableName The name of the array to validate (for error logging).
         * @param minLength The minimum length of the array.
         */
        validateArray(object: any[], name: string, minLength: number): void;
    }
}

/** OBJECT */
if (!Object.throwIfNull) {
    Object.throwIfNull = (object: unknown, name: string) => {
        if (!name || name === '') {
            throw new Error(`When using throwIfNull, the argument ['variableName'] must not be empty, null, or undefined.`);
        }

        if (object === null) {
            throw new ArgumentNullException(`['${ name }'] must not be null.`, name);
        }
    };
}

if (!Object.throwIfUndefined) {
    Object.throwIfUndefined = (object: unknown, name: string) => {
        if (!name || name === '') {
            throw new Error(`When using throwIfUndefined, the argument ['name'] must not be empty, null, or undefined.`);
        }

        if ((object) === undefined) {
            throw new ArgumentNullException(`['${ name }'] must not be undefined.`, name);
        }
    };
}

if (!Object.throwIfNullOrUndefined) {
    Object.throwIfNullOrUndefined = (object: unknown, name: string) => {
        if (!name || name === '') {
            throw new Error(`When using throwIfNullOrUndefined, the argument ['name'] must not be empty, null, or undefined.`);
        }
        Object.throwIfNull(object, name);
        Object.throwIfUndefined(object, name);
    };
}

/** STRING */
if (!String.throwIfEmpty) {
    String.throwIfEmpty = (object: string, name: string) => {
        if (!name || name === '') {
            throw new Error(`When using throwIfNullOrEmpty, the argument ['name'] must not be empty, null, or undefined.`);
        }
        if (object === '') {
            throw new TypeError(`['${ name }'] must not be an empty string.`);
        }
    };
}

if (!String.throwIfNull) {
    String.throwIfNull = (object: string, name: string) => {
        Object.throwIfNull(object, name);
    };
}

if (!String.throwIfUndefined) {
    String.throwIfUndefined = (object: string, name: string) => {
        Object.throwIfUndefined(object, name);
    };
}

if (!String.throwIfNullOrUndefined) {
    String.throwIfNullOrUndefined = (object: string, name: string) => {
        Object.throwIfNullOrUndefined(object, name);
    };
}

if (!String.throwIfNullUndefinedOrEmpty) {
    String.throwIfNullUndefinedOrEmpty = (object: string, name: string) => {
        if (!name || name === '') {
            throw new Error(`When using throwIfNullOrEmpty, the argument ['name'] must not be empty, null, or undefined.`);
        }
        Object.throwIfNullOrUndefined(object, name);
        String.throwIfEmpty(object, name);
    };
}

/** ARRAY */
if (!Array.validateArray) {
    Array.validateArray = (object: any[], name: string, minLength = 0) => {
        if (!name || name === '') {
            throw new Error(`When using validateArray, the argument ['name'] must not be empty, null, or undefined.`);
        }
        Object.throwIfNullOrUndefined(object, name);
        if (object.length < minLength) {
            throw new Error(`Array ['${ name }'] has a length of ${ object.length }, but is expected to have at least ${ minLength } items.`);
        }
    };
}
