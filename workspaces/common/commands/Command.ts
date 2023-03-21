import { ArgumentNullException } from "common/errors";
import { Disposable } from "../lifecycle";

const FALSE: () => boolean = () => false;
const TRUE: () => boolean = () => true;
const NOOP: () => void = () => { };

/* Everything should be optional on these interfaces,
because they are meant to be used by clients as json objects,
and then resolved to classes by code. */

/** Defines the properties that a `Command` can have. */
export interface Command {
    /** The code to execute when the command is activated. */
    execute?: (...args: any[]) => void | any;

    /** The id of the command. */
    readonly id?: string;

    /** Whether the command is disabled or not. */
    isEnabled?: () => boolean;
}
export function resolveCommand(item: Command): ResolvedCommand {
    return ResolvedCommand.resolve(item);
}

/** Defines the properties that a `Command` can have, with defaults. */
export class ResolvedCommand extends Disposable implements Command {
    execute: (...args: any[]) => void | any;
    readonly id: string;
    isEnabled: () => boolean;

    /** Whether the command is disabled or not. */
    get disabled(): boolean { return !this.isEnabled(); }

    constructor();
    constructor(options: Command);
    constructor(options?: Command) {
        super();
        this.execute = options?.execute ?? NOOP;
        this.id = options?.id ?? '';
        this.isEnabled = options?.isEnabled ?? TRUE;
    }
    public static resolve(item: Command): ResolvedCommand {
        return new ResolvedCommand(item);
    }
}
