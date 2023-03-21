import { Exception } from './Exception';

const defaultMessage = 'Value does not fall within the expected range.'

export class ArgumentException extends Exception {

    /**
     * The exception that is the cause of the current exception, or a null
     * reference if no inner exception is specified.
     */
    public readonly innerException: Exception;

    /** The error message that explains the reason for this exception. */
    public readonly message: string;

    /** Gets the name of the parameter that causes this exception. */
    public readonly paramName: string;

    /** Initializes a new instance of the 'ArgumentException'. */
    public constructor();

    /**
     * Initializes a new instance of the `ArgumentException`
     * with a specified error message.
     * @param message The error message that explains the reason
     * for the exception.
     */
    public constructor(message: string);

    /**
     * Initializes a new instance of the `ArgumentException`
     * with a specified error message and a reference to the
     * inner exception that is the cause of this exception.
     * @param message The error message that explains the reason
     * for the exception.
     * @param innerException The exception that is the cause
     * of the current exception. If the innerException parameter
     * is not a null reference, the current exception is raised
     * in a catch block that handles the inner exception.
     */
    public constructor(message: string, innerException: Exception);

    /**
     * Initializes a new instance of the `ArgumentException`
     * with a specified error message and the name of the
     * parameter that causes this exception.
     * @param message The error message that explains the reason
     * for the exception.
     * @param paramName The name of the parameter that caused
     * the current exception.
     */
    public constructor(message: string, paramName: string);

    /**
     * Initializes a new instance of the `ArgumentException`
     * with a specified error message, the parameter name,
     * and a reference to the inner exception that is the
     * cause of this exception.
     * @param message The error message that explains the reason
     * for the exception.
     * @param paramName The name of the parameter that caused
     * the current exception.
     * @param innerException The exception that is the cause
     * of the current exception. If the innerException parameter
     * is not a null reference, the current exception is raised
     * in a catch block that handles the inner exception.
     */
    public constructor(message: string, paramName: string, innerException: Exception);

    public constructor(message?: string, paramOrException?: string | Exception, innerException?: Exception) {
        super();

        if (message == null && paramOrException == null && innerException == null) {
            // signature is ...()
            this.message = defaultMessage;
            this.paramName = null;
            this.innerException = null;
        } else if (paramOrException == null && innerException == null) {
            // signature is ...(message)
            this.message = message;
            this.paramName = null;
            this.innerException = null;
        } else if (innerException == null && typeof paramOrException === 'string') {
            // signature is ...(message, paramName)
            this.message = message;
            this.paramName = paramOrException;
            this.innerException = null;
        } else if (innerException == null && typeof paramOrException !== 'string') {
            // signature is ...(message, innerException)
            this.message = message;
            this.paramName = null;
            this.innerException = paramOrException;
        } else if (typeof paramOrException === 'string') {
            // signature is ...(message, paramName, innerException)
            this.message = message;
            this.paramName = paramOrException;
            this.innerException = innerException;
        }
    }
}
