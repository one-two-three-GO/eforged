/* eslint-disable unicorn/prevent-abbreviations */

import '../dev/CodeValidationExtensions';
import { OperatingSystem } from "../platform/OperatingSystem";
import { ArgumentException, ArgumentNullException } from '../errors';
import { Predicate, ALWAYS } from '../Predicate';
import { labelForOS } from './resolvers';

export class ConditionalLabel {
    public label = ""
    public predicate: Predicate<OperatingSystem>;

    constructor(label: string, predicate: Predicate<OperatingSystem>) {
        if (label == null)
            throw new ArgumentNullException('label');

        if (predicate == null)
            throw new ArgumentNullException('predicate');

        this.label = label;
        this.predicate = predicate;
    }

    public toString() { return this.label; }
}

/**
 *  A possible keystroke. This includes
 *
 * - A UI label for use in menus
 * - a UI label for use in settings
 */
export class KeyCode {

    /** The identifier for the KeyCode. */
    public readonly id: string;

    /** The `KeyboardEvent` key value. */
    public readonly key: string | null;

    /** Is this KeyCode a modifier key (`Alt`, `Ctrl`, `Meta`, or `Shift`)? */
    public readonly isModifier: boolean;

    /** A word or symbol to be used in menus and shortcuts to describe the key. */
    public readonly uiLabel: ConditionalLabel[] = [];

    /** A word to be used in a settings page to describe the key. */
    public readonly settingsLabel: ConditionalLabel[] = [];

    constructor(keyBoardEventKeyValue: string | null, uiLabel: string | ConditionalLabel[]);
    constructor(keyBoardEventKeyValue: string | null, uiLabel: string | ConditionalLabel[], settingsLabel: string | ConditionalLabel[]);
    constructor(keyBoardEventKeyValue: string | null, uiLabel: string | ConditionalLabel[], settingsLabel: string | ConditionalLabel[], isModifier: boolean);
    constructor(keyBoardEventKeyValue?: string | null, uiLabel?: string | ConditionalLabel[], settingsLabel?: string | ConditionalLabel[], isModifier = false) {
        if (keyBoardEventKeyValue === undefined)
            return;

        this.key = keyBoardEventKeyValue === null ? null : keyBoardEventKeyValue.toLowerCase();

        this.isModifier = isModifier;

        if (keyBoardEventKeyValue == null) {
            this.id = 'Unknown';
        } else if (keyBoardEventKeyValue.length === 0) {
            throw new ArgumentException('keyBoardEventKeyValue must not be null or empty.')
        } else {
            this.id = keyBoardEventKeyValue;
        }

        if (typeof uiLabel === 'string' && typeof settingsLabel === 'string') {
            this.uiLabel.push(new ConditionalLabel(uiLabel, ALWAYS));
            this.settingsLabel.push(new ConditionalLabel(settingsLabel, ALWAYS));
            return;
        }

        if (typeof uiLabel === 'string' && settingsLabel === undefined) {
            this.uiLabel.push(new ConditionalLabel(uiLabel, ALWAYS));
            this.settingsLabel.push(this.uiLabel[0]);
            return;
        }

        if (typeof uiLabel === 'string' && typeof settingsLabel !== 'string') {
            this.uiLabel.push(new ConditionalLabel(uiLabel, ALWAYS));
            this.settingsLabel = settingsLabel ?? [];
            return;
        }

        if (typeof uiLabel !== 'string' && typeof settingsLabel === 'string') {
            this.uiLabel = uiLabel ?? [];
            this.settingsLabel.push(new ConditionalLabel(settingsLabel, ALWAYS));
            return;
        }

        if (typeof uiLabel !== 'string' && settingsLabel === undefined) {
            throw new ArgumentNullException("Cannot uniquely identify settingsLabel.", 'settingsLabel');
        }

        if (typeof uiLabel !== 'string' && typeof settingsLabel !== 'string') {
            this.uiLabel = uiLabel ?? [];
            this.settingsLabel = settingsLabel ?? [];
        }
    }

    public static resolve(code: string | KeyCode | null | undefined): KeyCode {
        if (code == null) return NONE;
        if (code instanceof KeyCode) return code;

        const found = KEY_LIST.find(it => it.key?.toLowerCase() == code.toLowerCase());
        return found ?? Unknown;
    }

    //#region equality

    public equals(candidate: KeyCode): boolean;
    public equals(candidate: unknown): boolean;
    public equals(candidate: KeyCode | unknown): boolean {
        return KeyCode.equals(this, candidate);
    }

    public static equals(lhs: KeyCode, rhs: KeyCode | unknown): boolean {
        if (rhs == null) return false;
        if (lhs == null) return false;

        if (rhs === lhs) return true;

        if (!(rhs instanceof KeyCode)) return false;

        if (lhs.key?.toLowerCase() !== rhs.key?.toLowerCase()) return false;

        const sameUILabelLength = lhs.uiLabel.length === rhs.uiLabel.length;
        if (!sameUILabelLength) return false;

        const sameSettingsLabelLength = lhs.settingsLabel.length === rhs.settingsLabel.length;
        if (!sameSettingsLabelLength) return false;

        const uiLabelsMatch = lhs.uiLabel.every((value: ConditionalLabel, index: number) => {
            return rhs.uiLabel[index] == value;
        });
        if (!uiLabelsMatch) return false;

        const settingsLabelsMatch = lhs.settingsLabel.every(
            (value: ConditionalLabel, index: number) => {
                return rhs.settingsLabel[index] == value;
            }
        );
        return settingsLabelsMatch;
    }

    // public static matches(lhs: KeyCode | string, rhs: KeyCode | string): boolean {
    //     var match = KeyCode.getKeyCode(lhs)?.key == KeyCode.getKeyCode(rhs)?.key;
    //     return match;
    // }

    //#endregion equality

    public toString(os?: OperatingSystem): string {
        return labelForOS(this.settingsLabel, os);
    }
}

//#region Codes

export const NONE = new KeyCode(null, "none");
export const Unknown = new KeyCode(null, "unknown");


// const DependsOnKbLayout = new KeyCode(null, '');
export const KeyCodeSeparator = new KeyCode(null,
    [
        new ConditionalLabel("+", (os) => os != OperatingSystem.Macintosh),
        new ConditionalLabel("", (os) => os == OperatingSystem.Macintosh)
    ], "+");


/** The `Shift` key. */
export const Shift = new KeyCode("Shift",
    [
        new ConditionalLabel("Shift", (os) => os != OperatingSystem.Macintosh),
        new ConditionalLabel("⇧", (os) => os == OperatingSystem.Macintosh)
    ],
    "Shift", true);

/** The `Control`, `Ctrl`, or `Ctl` key. */
export const Ctrl = new KeyCode("Control",
    [
        new ConditionalLabel("Ctrl", (os) => os != OperatingSystem.Macintosh),
        new ConditionalLabel("⌃", (os) => os == OperatingSystem.Macintosh)
    ],
    "Ctrl", true);

/** The `Alt` key. */
export const Alt = new KeyCode("Alt",
    [
        new ConditionalLabel("Alt", (os) => os != OperatingSystem.Macintosh),
        new ConditionalLabel("⌥", (os) => os == OperatingSystem.Macintosh)
    ],
    "Alt", true);

/** The `Meta` key.
 *
 * This is the `Windows` logo key, or the `Command` or `⌘` key on Mac keyboards.
 */
export const Meta = new KeyCode("Meta",
    [
        new ConditionalLabel("Win", (os) => os == OperatingSystem.Windows),
        new ConditionalLabel("⌘", (os) => os == OperatingSystem.Macintosh),
        new ConditionalLabel("Super", (os) => os != OperatingSystem.Macintosh && os != OperatingSystem.Windows),
    ],
    [
        new ConditionalLabel("Windows", (os) => os == OperatingSystem.Windows),
        new ConditionalLabel("Command", (os) => os == OperatingSystem.Macintosh),
        new ConditionalLabel("Super", (os) => os != OperatingSystem.Macintosh && os != OperatingSystem.Windows),
    ], true);

/** The left arrow key. */
export const LeftArrow = new KeyCode("ArrowLeft",
    [
        new ConditionalLabel("LeftArrow", (os) => os != OperatingSystem.Macintosh),
        new ConditionalLabel("←", (os) => os == OperatingSystem.Macintosh)
    ],
    "Left");

/** The right arrow key. */
export const RightArrow = new KeyCode("ArrowRight",
    [
        new ConditionalLabel("RightArrow", (os) => os != OperatingSystem.Macintosh),
        new ConditionalLabel("→", (os) => os == OperatingSystem.Macintosh)
    ],
    "Right");

/** The up arrow key. */
export const UpArrow = new KeyCode("ArrowUp",
    [
        new ConditionalLabel("UpArrow", (os) => os != OperatingSystem.Macintosh),
        new ConditionalLabel("↑", (os) => os == OperatingSystem.Macintosh)
    ],
    "Up"
);

/** The down arrow key. */
export const DownArrow = new KeyCode("ArrowDown",
    [
        new ConditionalLabel("DownArrow", (os) => os != OperatingSystem.Macintosh),
        new ConditionalLabel("↓", (os) => os == OperatingSystem.Macintosh)
    ],
    "Down");


/** The `Backspace` key. This key is labeled `Delete` on Mac keyboards. */
export const Backspace = new KeyCode("Backspace", "Backspace");

/** The horizontal tab key, `Tab`. */
export const Tab = new KeyCode("Tab", "Tab");

/** The `Enter` or `↵` key (sometimes labeled `Return`). */
export const Enter = new KeyCode("Enter", "Enter");

/** The space key, `Space Bar`. */
export const Space = new KeyCode(" ", "Space");

/** The `Pause` key. */
export const PauseBreak = new KeyCode("Pause", "PauseBreak");

/** The `Caps Lock` or `Caps` key. */
export const CapsLock = new KeyCode("CapsLock", "CapsLock");

/** The `Esc` key. */
export const Escape = new KeyCode("Escape", "Escape");

/** The `Page Up` (or `PgUp`) key. */
export const PageUp = new KeyCode("PageUp", "PageUp");

/** The `Page Down` (or `PgDn`) key. */
export const PageDown = new KeyCode("PageDown", "PageDown");

/** The `End` key. */
export const End = new KeyCode("End", "End");

/** The `Home` key. */
export const Home = new KeyCode("Home", "Home");

/** The `Insert` (or `Ins`) key. */
export const Insert = new KeyCode("Insert", "Insert");

/** The `Del` key. */
export const Delete = new KeyCode("Del", "Delete");

export const KEY_0 = new KeyCode("0", "0");
export const KEY_1 = new KeyCode("1", "1");
export const KEY_2 = new KeyCode("2", "2");
export const KEY_3 = new KeyCode("3", "3");
export const KEY_4 = new KeyCode("4", "4");
export const KEY_5 = new KeyCode("5", "5");
export const KEY_6 = new KeyCode("6", "6");
export const KEY_7 = new KeyCode("7", "7");
export const KEY_8 = new KeyCode("8", "8");
export const KEY_9 = new KeyCode("9", "9");

export const KEY_A = new KeyCode("a", "A");
export const KEY_B = new KeyCode("b", "B");
export const KEY_C = new KeyCode("c", "C");
export const KEY_D = new KeyCode("d", "D");
export const KEY_E = new KeyCode("e", "E");
export const KEY_F = new KeyCode("f", "F");
export const KEY_G = new KeyCode("g", "G");
export const KEY_H = new KeyCode("h", "H");
export const KEY_I = new KeyCode("i", "I");
export const KEY_J = new KeyCode("j", "J");
export const KEY_K = new KeyCode("k", "K");
export const KEY_L = new KeyCode("l", "L");
export const KEY_M = new KeyCode("m", "M");
export const KEY_N = new KeyCode("n", "N");
export const KEY_O = new KeyCode("o", "O");
export const KEY_P = new KeyCode("p", "P");
export const KEY_Q = new KeyCode("q", "Q");
export const KEY_R = new KeyCode("r", "R");
export const KEY_S = new KeyCode("s", "S");
export const KEY_T = new KeyCode("t", "T");
export const KEY_U = new KeyCode("u", "U");
export const KEY_V = new KeyCode("v", "V");
export const KEY_W = new KeyCode("w", "W");
export const KEY_X = new KeyCode("x", "X");
export const KEY_Y = new KeyCode("y", "Y");
export const KEY_Z = new KeyCode("z", "Z");

/** Typically found between the `Windows` (or `OS`) key and the `Control` key on the right side of the keyboard. */
export const ContextMenu = new KeyCode("ContextMenu", "ContextMenu");

/** The `F1` key. */
export const F1 = new KeyCode("F1",
    [
        new ConditionalLabel("F1", (os) => os != OperatingSystem.Macintosh),
        new ConditionalLabel("\uF704", (os) => os == OperatingSystem.Macintosh)
    ],
    [
        new ConditionalLabel("F1", (os) => os != OperatingSystem.Macintosh),
        new ConditionalLabel("\uF704", (os) => os == OperatingSystem.Macintosh)
    ]);

/** The `F2` key. */
export const F2 = new KeyCode("F2",
    [
        new ConditionalLabel("F2", (os) => os != OperatingSystem.Macintosh),
        new ConditionalLabel("\uF705", (os) => os == OperatingSystem.Macintosh)
    ],
    [
        new ConditionalLabel("F2", (os) => os != OperatingSystem.Macintosh),
        new ConditionalLabel("\uF705", (os) => os == OperatingSystem.Macintosh)
    ]
);

/** The `F3` key. */
export const F3 = new KeyCode("F3",
    [
        new ConditionalLabel("F3", (os) => os != OperatingSystem.Macintosh),
        new ConditionalLabel("\uF706", (os) => os == OperatingSystem.Macintosh)
    ], [
    new ConditionalLabel("F3", (os) => os != OperatingSystem.Macintosh),
    new ConditionalLabel("\uF706", (os) => os == OperatingSystem.Macintosh)
]);

/** The `F4` key. */
export const F4 = new KeyCode("F4",
    [
        new ConditionalLabel("F4", (os) => os != OperatingSystem.Macintosh),
        new ConditionalLabel("\uF707", (os) => os == OperatingSystem.Macintosh)
    ], [
    new ConditionalLabel("F4", (os) => os != OperatingSystem.Macintosh),
    new ConditionalLabel("\uF707", (os) => os == OperatingSystem.Macintosh)
]);

/** The `F5` key. */
export const F5 = new KeyCode("F5",
    [
        new ConditionalLabel("F5", (os) => os != OperatingSystem.Macintosh),
        new ConditionalLabel("\uF708", (os) => os == OperatingSystem.Macintosh)
    ], [
    new ConditionalLabel("F5", (os) => os != OperatingSystem.Macintosh),
    new ConditionalLabel("\uF708", (os) => os == OperatingSystem.Macintosh)
]);

/** The `F6` key. */
export const F6 = new KeyCode("F6",
    [
        new ConditionalLabel("F6", (os) => os != OperatingSystem.Macintosh),
        new ConditionalLabel("\uF709", (os) => os == OperatingSystem.Macintosh)
    ], [
    new ConditionalLabel("F6", (os) => os != OperatingSystem.Macintosh),
    new ConditionalLabel("\uF709", (os) => os == OperatingSystem.Macintosh)
]);

/** The `F7` key. */
export const F7 = new KeyCode("F7",
    [
        new ConditionalLabel("F7", (os) => os != OperatingSystem.Macintosh),
        new ConditionalLabel("\uF70A", (os) => os == OperatingSystem.Macintosh)
    ], [
    new ConditionalLabel("F7", (os) => os != OperatingSystem.Macintosh),
    new ConditionalLabel("\uF70A", (os) => os == OperatingSystem.Macintosh)
]);

/** The `F8` key. */
export const F8 = new KeyCode("F8",
    [
        new ConditionalLabel("F8", (os) => os != OperatingSystem.Macintosh),
        new ConditionalLabel("\uF70B", (os) => os == OperatingSystem.Macintosh)
    ], [
    new ConditionalLabel("F8", (os) => os != OperatingSystem.Macintosh),
    new ConditionalLabel("\uF70B", (os) => os == OperatingSystem.Macintosh)
]);

/** The `F9` key. */
export const F9 = new KeyCode("F9",
    [
        new ConditionalLabel("F9", (os) => os != OperatingSystem.Macintosh),
        new ConditionalLabel("\uF70C", (os) => os == OperatingSystem.Macintosh)
    ], [
    new ConditionalLabel("F9", (os) => os != OperatingSystem.Macintosh),
    new ConditionalLabel("\uF70C", (os) => os == OperatingSystem.Macintosh)
]);

/** The `F10` key. */
export const F10 = new KeyCode("F10",
    [
        new ConditionalLabel("F10", (os) => os != OperatingSystem.Macintosh),
        new ConditionalLabel("\uF70D", (os) => os == OperatingSystem.Macintosh)
    ], [
    new ConditionalLabel("F10", (os) => os != OperatingSystem.Macintosh),
    new ConditionalLabel("\uF70D", (os) => os == OperatingSystem.Macintosh)
]);

/** The `F11` key. */
export const F11 = new KeyCode("F11",
    [
        new ConditionalLabel("F11", (os) => os != OperatingSystem.Macintosh),
        new ConditionalLabel("\uF70E", (os) => os == OperatingSystem.Macintosh)
    ], [
    new ConditionalLabel("F11", (os) => os != OperatingSystem.Macintosh),
    new ConditionalLabel("\uF70E", (os) => os == OperatingSystem.Macintosh)
]);

/** The `F12` key. */
export const F12 = new KeyCode("F12",
    [
        new ConditionalLabel("F12", (os) => os != OperatingSystem.Macintosh),
        new ConditionalLabel("\uF70F", (os) => os == OperatingSystem.Macintosh)
    ], [
    new ConditionalLabel("F12", (os) => os != OperatingSystem.Macintosh),
    new ConditionalLabel("\uF70F", (os) => os == OperatingSystem.Macintosh)
]);

/** The `F13` key. */
export const F13 = new KeyCode("F13",
    [
        new ConditionalLabel("F13", (os) => os != OperatingSystem.Macintosh),
        new ConditionalLabel("\uF710", (os) => os == OperatingSystem.Macintosh)
    ], [
    new ConditionalLabel("F13", (os) => os != OperatingSystem.Macintosh),
    new ConditionalLabel("\uF710", (os) => os == OperatingSystem.Macintosh)
]);

/** The `F14` key. */
export const F14 = new KeyCode("F14",
    [
        new ConditionalLabel("F14", (os) => os != OperatingSystem.Macintosh),
        new ConditionalLabel("\uF711", (os) => os == OperatingSystem.Macintosh)
    ], [
    new ConditionalLabel("F14", (os) => os != OperatingSystem.Macintosh),
    new ConditionalLabel("\uF711", (os) => os == OperatingSystem.Macintosh)
]);

/** The `F15` key. */
export const F15 = new KeyCode("F15",
    [
        new ConditionalLabel("F15", (os) => os != OperatingSystem.Macintosh),
        new ConditionalLabel("\uF712", (os) => os == OperatingSystem.Macintosh)
    ], [
    new ConditionalLabel("F15", (os) => os != OperatingSystem.Macintosh),
    new ConditionalLabel("\uF712", (os) => os == OperatingSystem.Macintosh)
]);

/** The `F16` key. */
export const F16 = new KeyCode("F16",
    [
        new ConditionalLabel("F16", (os) => os != OperatingSystem.Macintosh),
        new ConditionalLabel("\uF713", (os) => os == OperatingSystem.Macintosh)
    ], [
    new ConditionalLabel("F16", (os) => os != OperatingSystem.Macintosh),
    new ConditionalLabel("\uF713", (os) => os == OperatingSystem.Macintosh)
]);

/** The `F17` key. */
export const F17 = new KeyCode("F17",
    [
        new ConditionalLabel("F17", (os) => os != OperatingSystem.Macintosh),
        new ConditionalLabel("\uF714", (os) => os == OperatingSystem.Macintosh)
    ], [
    new ConditionalLabel("F17", (os) => os != OperatingSystem.Macintosh),
    new ConditionalLabel("\uF714", (os) => os == OperatingSystem.Macintosh)
]);

/** The `F18` key. */
export const F18 = new KeyCode("F18",
    [
        new ConditionalLabel("F18", (os) => os != OperatingSystem.Macintosh),
        new ConditionalLabel("\uF715", (os) => os == OperatingSystem.Macintosh)
    ], [
    new ConditionalLabel("F18", (os) => os != OperatingSystem.Macintosh),
    new ConditionalLabel("\uF715", (os) => os == OperatingSystem.Macintosh)
]);

/** The `F19` key. */
export const F19 = new KeyCode("F19",
    [
        new ConditionalLabel("F19", (os) => os != OperatingSystem.Macintosh),
        new ConditionalLabel("\uF716", (os) => os == OperatingSystem.Macintosh)
    ], [
    new ConditionalLabel("F19", (os) => os != OperatingSystem.Macintosh),
    new ConditionalLabel("\uF716", (os) => os == OperatingSystem.Macintosh)
]);

/** The `NumLock` (Number Lock) key. */
export const NumLock = new KeyCode("NumLock", "NumLock");

/** The `Scroll Lock` key. */
export const ScrollLock = new KeyCode("ScrollLock", "ScrollLock");

/** Used for miscellaneous characters; it can vary by keyboard.
For the US standard keyboard, the ';:' key
*/
export const US_SEMICOLON = new KeyCode(";", ";");

/** Used for miscellaneous characters; it can vary by keyboard.
For the US standard keyboard, the '=+' key
*/
export const US_EQUAL = new KeyCode("=", "=");

/** Used for miscellaneous characters; it can vary by keyboard.
For the US standard keyboard, the ',<' key
*/
export const US_COMMA = new KeyCode(",", ",");

/** Used for miscellaneous characters; it can vary by keyboard.
For the US standard keyboard, the '-_' key
*/
export const US_MINUS = new KeyCode("-", "-");

/** Used for miscellaneous characters; it can vary by keyboard.
For the US standard keyboard, the '.>' key
*/
export const US_DOT = new KeyCode(".", ".");

/** Used for miscellaneous characters; it can vary by keyboard.
For the US standard keyboard, the '/?' key
*/
export const US_SLASH = new KeyCode("/", "/");

/** Used for miscellaneous characters; it can vary by keyboard.
For the US standard keyboard, the '`~' key
*/
export const US_BACKTICK = new KeyCode("`", "`");

/** Used for miscellaneous characters; it can vary by keyboard.
For the US standard keyboard, the '[{' key
*/
export const US_OPEN_SQUARE_BRACKET = new KeyCode("[", "[");

/** Used for miscellaneous characters; it can vary by keyboard.
For the US standard keyboard, the '\|' key
*/
export const US_BACKSLASH = new KeyCode("\\", "\\");

/** Used for miscellaneous characters; it can vary by keyboard.
 For the US standard keyboard, the ']}' key
*/
export const US_CLOSE_SQUARE_BRACKET = new KeyCode("]", "]");

/** Used for miscellaneous characters; it can vary by keyboard.
For the US standard keyboard, the ''"' key
*/
export const US_QUOTE = new KeyCode("'", "'");

//#endregion

//#region Code List

const KEY_LIST: KeyCode[] = [

    NONE, Unknown,

    Shift, Ctrl, Alt, Meta,
    LeftArrow, RightArrow, UpArrow, DownArrow,
    Backspace, Tab, Enter, Space, PauseBreak, CapsLock, Escape,
    PageUp, PageDown, End, Home, Insert, Delete,

    KEY_0, KEY_1, KEY_2, KEY_3, KEY_4, KEY_5, KEY_6, KEY_7, KEY_8, KEY_9,

    KEY_A, KEY_B, KEY_C, KEY_D, KEY_E, KEY_F, KEY_G, KEY_H, KEY_I, KEY_J, KEY_K, KEY_L, KEY_M, KEY_N, KEY_O, KEY_P, KEY_Q, KEY_R, KEY_S, KEY_T, KEY_U, KEY_V, KEY_W, KEY_X, KEY_Y, KEY_Z,

    ContextMenu,
    F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11, F12, F13, F14, F15, F16, F17, F18, F19,

    NumLock, ScrollLock, US_SEMICOLON, US_EQUAL, US_COMMA, US_MINUS, US_DOT, US_SLASH,
    US_BACKTICK, US_OPEN_SQUARE_BRACKET, US_BACKSLASH, US_CLOSE_SQUARE_BRACKET, US_QUOTE
];

//#endregion
