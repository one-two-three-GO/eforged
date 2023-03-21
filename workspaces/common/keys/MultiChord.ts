import { KeyChord } from "./KeyChord";
import { ResolvedMultiChord } from "./resolvers";

/* Everything should be optional on these interfaces,
because they are meant to be used by clients as json objects,
and then resolved to classes by code. */

/** Multiple keyboard inputs in succession. */
export interface MultiChord {
    parts: KeyChord[];
}
export function resolveMultiChord(chord?: KeyChord | KeyChord[] | MultiChord | undefined): ResolvedMultiChord {
    return new ResolvedMultiChord(chord);
}
export function isMultiChord(obj: MultiChord | unknown): obj is MultiChord {
    if (typeof obj !== 'object') return false;
    if (obj === null) return false;
    return !!('parts' in obj);
}
