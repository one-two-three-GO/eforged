import { extension } from '../dev';
import { Alt, ConditionalLabel, Ctrl, KeyCode, KeyCodeSeparator, Meta, NONE, Shift, Unknown } from "./keycodes";
import { isKeyChord, isKeyChordArray, KeyChord } from "./KeyChord";
import { isMultiChord, MultiChord } from './MultiChord';
import { ArgumentException, ArgumentNullException } from '../errors';
import { OperatingSystem, os } from '../platform';

/** A single keyboard input. */
export class ResolvedKeyChord implements KeyChord {
    public ctrlKey: boolean = false;
    public shiftKey: boolean = false;
    public altKey: boolean = false;
    public metaKey: boolean = false;
    public key: KeyCode = NONE;

    public constructor(chord?: KeyChord) {
        if (!chord) return;
        this.ctrlKey = chord.ctrlKey ?? false;
        this.shiftKey = chord.shiftKey ?? false;
        this.altKey = chord.altKey ?? false;
        this.metaKey = chord.metaKey ?? false;
        this.key = KeyCode.resolve(chord.key);
    }

    static equals(thisArg: ResolvedKeyChord, other: ResolvedKeyChord | unknown): boolean {
        if (other == null) return false;
        if (other == this) return true;

        if (!(other instanceof ResolvedKeyChord))
            return false;

        return (thisArg.ctrlKey === other.ctrlKey) &&
            (thisArg.shiftKey === other.shiftKey) &&
            (thisArg.altKey === other.altKey) &&
            (thisArg.metaKey === other.metaKey) &&
            (thisArg.key === other.key);
    }
}
export interface ResolvedKeyChord {

    /** Determines whether the specified Keybinding is equal to the current Keybinding.
     * @returns `   true` if the specified Keybinding is equal to the current Keybinding, otherwise, `false`.
     */
    equals(other: ResolvedKeyChord): boolean;

    /** Determines whether the specified object is equal to the current Keybinding.
     * @returns `   true` if the specified object is equal to the current Keybinding, otherwise, `false`.
     */
    equals(other: unknown): boolean;
    equals(other: ResolvedKeyChord | unknown): boolean;
}
export class ResolvedKeyChordExtensions {
    @extension(ResolvedKeyChord)
    static equals(thisArg: ResolvedKeyChord, other: ResolvedKeyChord | unknown): boolean {
        return ResolvedKeyChord.equals(thisArg, other);
    }
}
function isResolvedKeyChord(it: ResolvedKeyChord | unknown): it is ResolvedKeyChord {
    const candidate = it as ResolvedKeyChord;
    if (candidate == null) return false;

    // It's not a chord if it's a predicate/function
    if (typeof candidate !== 'object')
        return false;

    return candidate.key !== undefined &&
        typeof candidate.altKey !== undefined &&
        typeof candidate.ctrlKey !== undefined &&
        typeof candidate.metaKey !== undefined &&
        typeof candidate.shiftKey !== undefined;
}

/** Multiple keyboard inputs in succession. */
export class ResolvedMultiChord implements MultiChord {

    /** The ordered set of keyboard inputs. */
    public readonly parts: ResolvedKeyChord[] = [];

    public constructor(chord?: KeyChord | KeyChord[] | MultiChord) {
        if (chord == null)
            return;

        let partsToUse: ResolvedKeyChord[];

        if (!isKeyChord(chord) && !isMultiChord(chord) && !isKeyChordArray(chord))
            throw new ArgumentNullException('chord');

        if (isKeyChordArray(chord)) {
            partsToUse = chord.map(it => new ResolvedKeyChord(it));
        } else if (isKeyChord(chord)) {
            partsToUse = [new ResolvedKeyChord(chord)];
        } else {
            partsToUse = chord.parts.map(it => new ResolvedKeyChord(it));
        }

        this.parts = partsToUse;
    }

    static equals(thisArg: ResolvedMultiChord, other: ResolvedMultiChord | unknown): boolean {
        if (other == null) return false;
        if (other == this) return true;

        if (!(other instanceof ResolvedMultiChord))
            return false;

        if (thisArg.parts.length !== other.parts.length)
            return false;

        let result = true;
        thisArg.parts.forEach((kb, index) => {
            result = result && kb.equals(other.parts[index]);
        });
        return result;
    }

    toString(): string {
        return getSettingsLabel(this);
    }
}
export interface ResolvedMultiChord {

    /** Determines whether the specified ChordKeybinding is equal to the current ChordKeybinding.
     * @returns `true` if the specified ChordKeybinding is equal to the current Keybinding, otherwise, `false`.
     */
    equals(other: ResolvedMultiChord): boolean;

    /** Determines whether the specified object is equal to the current ChordKeybinding.
     * @returns `true` if the specified object is equal to the current ChordKeybinding, otherwise, `false`.
     */
    equals(other: unknown): boolean;
    equals(other: ResolvedMultiChord | unknown): boolean;
}
export class ResolvedMultiChordExtensions {
    @extension(ResolvedMultiChord)
    static equals(thisArg: ResolvedMultiChord, other: ResolvedMultiChord | unknown): boolean {
        return ResolvedMultiChord.equals(thisArg, other);
    }
}
function isResolvedMultiChord(it: ResolvedMultiChord | unknown): it is ResolvedMultiChord {
    const candidate = it as ResolvedMultiChord;

    // It's not a ChordArray if it's a predicate/function
    if (typeof candidate !== 'object') return false;

    const hasLength = (typeof candidate.parts?.length !== 'undefined');
    return hasLength;
}


export function labelForOS(labels: ConditionalLabel[], operatingSystem?: OperatingSystem): string {
    const osToUse: OperatingSystem = operatingSystem ?? os;
    var possibilities = labels.filter(it => it.predicate(osToUse));
    if (!possibilities || possibilities.length != 1)
        throw new ArgumentException('Cannot uniquely identify label.');
    return possibilities[0].toString();
}

function getSettingsLabel(key: ResolvedKeyChord | ResolvedMultiChord, operatingSystem?: OperatingSystem): string {
    if (key == null)
        throw new ArgumentNullException('key');
    const osToUse: OperatingSystem = operatingSystem ?? os;


    const getLabel = (key: KeyCode | string) => {
        const keyCode = KeyCode.resolve(key);
        return keyCode.toString(osToUse);
    }
    return compileKeybindLabel(key, osToUse, getLabel);
}

type getLabelFunc = (code: KeyCode | string) => string;

function compileKeybindLabel(keys: ResolvedKeyChord | ResolvedMultiChord, operatingSystem: OperatingSystem, getLabel: getLabelFunc): string {
    if (keys == null)
        throw new ArgumentNullException("keys");

    if (isResolvedKeyChord(keys)) {

        const addBit = (result: string, bit: string, sep: string) => {
            if (result)
                result += sep;

            result += bit
            return result;
        }

        // Get the different 'bits' or parts of the label.
        const sep = getLabel(KeyCodeSeparator);

        let result = '';

        if (keys.ctrlKey)
            result = addBit(result, getLabel(Ctrl), sep);

        if (keys.shiftKey)
            result = addBit(result, getLabel(Shift), sep);

        if (keys.altKey)
            result = addBit(result, getLabel(Alt), sep);

        if (keys.metaKey)
            result = addBit(result, getLabel(Meta), sep);

        if (keys.key && !KeyCode.equals(keys.key, Unknown))
            result = addBit(result, getLabel(keys.key), sep);

        return result;
    } else if (isResolvedMultiChord(keys)) {
        if (keys == null || keys.parts == null || keys.parts.length == 0)
            return '';
        const result: string[] = [];
        for (let index = 0; index < keys.parts.length; index++) {
            const part = keys.parts[index];
            if (part == null)
                throw new ArgumentException('part must not be null.');
            const newItem = compileKeybindLabel(part, operatingSystem, getLabel);
            result.push(newItem);
        }
        return result.join(', ');
    } else {
        throw new ArgumentException('improper type');
    }
}
