import { ExtendableError } from './ExtendableError';

export class MultiDisposeError extends ExtendableError {
    constructor(public readonly errors: any[]) {
        super(`Encountered errors while disposing of store. Errors: [${ errors.join(', ') }]`);
    }
}
