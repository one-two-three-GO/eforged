import { isArray } from "../types";
import { KeyCode } from "./keycodes";
import { ResolvedKeyChord } from "./resolvers";

/* Everything should be optional on these interfaces,
because they are meant to be used by clients as json objects,
and then resolved to classes by code. */

/** A single keyboard input. */
export interface KeyChord {
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    metaKey?: boolean;
    key?: KeyCode | string | null;
}
export function resolveKeyChord(chord: KeyChord): ResolvedKeyChord {
    return new ResolvedKeyChord(chord);
}
export function isKeyChord(obj: KeyChord | unknown): obj is KeyChord {
    if (typeof obj !== 'object') return false;
    if (obj === null) return false;
    const hasCtrl = 'ctrlKey' in obj;
    const hasShift = 'shiftKey' in obj;
    const hasAlt = 'altKey' in obj;
    const hasMeta = 'metaKey' in obj;
    const hasKey = 'key' in obj;
    
    return hasCtrl || hasShift || hasAlt || hasMeta || hasKey;
}
export function isKeyChordArray(obj: KeyChord[] | unknown): obj is KeyChord[] {
    if (typeof obj !== 'object') return false;
    if (obj === null) return false;
    if (!isArray(obj)) return false;

    return obj.every(it => isKeyChord(it));
}


