import { ArgumentException } from './ArgumentException';
import { Exception } from './Exception';

const defaultMessage = 'Value cannot be null.'

function withParamName(name: string): string { return ` (Parameter: '${ name }')`; }

/** The exception that is thrown when a null reference is passed to a method that does not accept it as a valid argument. */
export class ArgumentNullException extends ArgumentException {

    /**
     * The exception that is the cause of the current exception, or a null
     * reference if no inner exception is specified.
     */
    public readonly innerException: Exception;

    /** The error message that explains the reason for this exception. */
    public readonly message: string;

    /** Gets the name of the parameter that causes this exception. */
    public readonly paramName: string;

    /** Initializes a new instance of the `ArgumentNullException`. */
    public constructor();

    /**
     * Initializes a new instance of the `ArgumentNullException`
     * with the name of the parameter that causes this exception.
     * @param paramName The name of the parameter that caused the exception.
     */
    public constructor(paramName: string);

    /**
     * Initializes a new instance of the `ArgumentNullException`
     * with a specified error message and the exception that is
     * the cause of this exception.
     * @param message The error message that explains the reason
     * for this exception.
     * @param innerException The exception that is the cause of
     * the current exception, or `null` if no inner exception is
     * specified.
     */
    public constructor(message: string, innerException: Exception);

    /**
     * Initializes an instance of the `ArgumentNullException`
     * with a specified error message and the name of the
     * parameter that causes this exception.
     * @param paramName The name of the parameter that caused the exception.
     * @param message A message that describes the error.
     */
    public constructor(paramName: string, message: string);

    public constructor(paramNameOrMessage?: string, messageOrInner?: string | Error) {
        super();

        if (paramNameOrMessage == null && messageOrInner == null) {
            // signature is ...()
            this.message = defaultMessage;
            this.paramName = null;
            this.innerException = null;
        } else if (messageOrInner == null) {
            // signature is ...(paramName)
            this.message = defaultMessage + withParamName(paramNameOrMessage);
            this.paramName = paramNameOrMessage;
            this.innerException = null;
        } else if (typeof messageOrInner === 'string') {
            // signature is ...(paramName, message)
            this.message = defaultMessage + withParamName(paramNameOrMessage);
            this.paramName = paramNameOrMessage;
            this.innerException = null;
        } else {
            // signature is ...(message, innerException).
            this.paramName = null;
            this.message = paramNameOrMessage;
            this.innerException = messageOrInner as Exception;
        }
    }
}
