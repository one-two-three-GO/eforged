import { KeyChord, MultiChord, ResolvedMultiChord, resolveMultiChord } from "../keys";
import { Command, ResolvedCommand } from "./Command";

/** Defines the properties that a `KeyBoundCommand` can have. */
export interface KeyBoundCommand extends Command {
    /** An application-global keyboard shortcut.
     * @examples
     * * [Ctrl+N], or
     * * { [Ctrl+K], [K] }.
     */
    keys?: KeyChord | KeyChord[] | MultiChord;
}
export function resolveKeyBoundCommand(item: KeyBoundCommand): ResolvedKeyBoundCommand {
    return ResolvedKeyBoundCommand.resolve(item);
}


/** Defines the properties that a `KeyBoundCommand` can have, with defaults. */
export class ResolvedKeyBoundCommand
    extends ResolvedCommand implements KeyBoundCommand {

    /** An application-global keyboard shortcut.
     * @examples
     * * [Ctrl+N], or
     * * { [Ctrl+K], [K] }.
     */
    keys: ResolvedMultiChord;

    constructor();
    constructor(opts: KeyBoundCommand);
    constructor(opts?: KeyBoundCommand) {
        super(opts);
        this.keys = resolveMultiChord(opts?.keys);
    }
    public static resolve(item: KeyBoundCommand): ResolvedKeyBoundCommand {
        return new ResolvedKeyBoundCommand(item);
    }
}
