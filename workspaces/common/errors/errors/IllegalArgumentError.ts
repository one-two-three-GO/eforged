import { ExtendableError } from "./ExtendableError";

export class IllegalArgumentError extends ExtendableError {
    public constructor();
    public constructor(name: string);
    public constructor(name?: string) {
        super(`Illegal argument` + name ? `: ${ name }` : "");
    }
}
