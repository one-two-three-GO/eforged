import { ExtendableError } from '../errors/ExtendableError';

/**
 * An Exception indicates conditions that a reasonable application
 * might want to catch.
 */
export class Exception extends ExtendableError {

    /** The name of this exception. */
    public readonly name: string;

    /** The error message that explains the reason for this exception. */
    public readonly message: string;

    /**
     * The exception that is the cause of the current exception, or a null
     * reference if no inner exception is specified.
     */
    public readonly innerException: Exception;

    /**
     * An Exception indicates conditions that a reasonable application
     * might want to catch.
     *
     * @constructor Initializes a new instance of the `Exception` class.
     */
    constructor();

    /**
     * An Exception indicates conditions that a reasonable application
     * might want to catch.
     *
     * @constructor Initializes a new instance of the `Exception` class
     * with a specified error message.
     * @param message The message that describes the error.
     */
    constructor(message: string);

    /**
     * An Exception indicates conditions that a reasonable application
     * might want to catch.
     *
     * @constructor Initializes a new instance of the `Exception` class with a
     * specified error message and a reference to the inner exception that is
     * the cause of this exception.
     * @param message The error message that explains the reason for the exception.
     * @param innerException The exception that is the cause of the current
     * exception, or a null reference if no inner exception is specified.
     */
    constructor(message: string, innerException: Exception);

    /**
     * An Exception indicates conditions that a reasonable application
     * might want to catch.
     *
     * @constructor Initializes a new instance of a class deriving from `Exception`.
     * @param message The error message that explains the reason for this exception.
     * @param innerException The exception that is the cause of the current
     * exception, or a null reference if no inner exception is specified.
     * @param name The name of the derived exception class.
     * @param implementationContext The Function that describes the constructor of
     * the derived exception class.
     */
    constructor(message: string, innerException: Exception, name: string, implementationContext: Function);

    // The actual constructor
    constructor(message?: string, innerException?: Exception, name?: string, implementationContext?: Function) {
        super(message);
        this.name = (name || 'Exception');
        this.innerException = (innerException || null);
        Error.captureStackTrace(this, (implementationContext || Exception));
    }

    /** Returns a string representing the exception. */
    toString(): string {
        return `${ this.name }: ${ this.message }`;
    }
}
