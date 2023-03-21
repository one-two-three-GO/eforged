import { ExtendableError } from './ExtendableError';

export class NotSupportedError extends ExtendableError {
    constructor(message?: string) {
        super(message || `Operation not supported.`);
    }
}
