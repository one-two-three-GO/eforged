import '../dev/CodeValidationExtensions';
import { KeyBoundCommand, ResolvedKeyBoundCommand } from '../commands';
import { ArgumentException, ArgumentNullException } from '../errors';

/* Everything should be optional on these interfaces,
because they are meant to be used by clients as json objects,
and then resolved to classes by code. */

/** Defines the properties that a `MenuItem` can have. */
export interface MenuItem extends KeyBoundCommand {

    /** The font-icon to the left of the item label. */
    icon?: string;

    /** The id of the menu item. */
    id?: string;

    /** Submenu items. */
    items?: MenuItem[] | undefined;

    /** The text of the menu item.
     *
     * Shortcut Keys: To include a shortcut key (part of the name of a menu item
     * or button, where it can be underlined, and is available (without modifiers)
     * when that menu item is directly available), use the ampersand before the
     * desired shortcut key.
     *
     * For example: to use the letter 'n' as the shortcut key for a menu item
     * with the name 'New File', you would set the label to '&New File'.
     *
     * To display an actual ampersand in a menu item, use two ampersands.
     * For example "Big & Tall" would have the label 'Big && Tall'.
     *
     * Ampersands cannot be shorcut keys.
     */
    label?: string;

    /** Is this item a menu separator? */
    separator?: boolean;

    /** The tooltip.
     *
     * Do NOT simply repeat the label or name of the menu item:
     * Offer some advisory information about the menu item,
     * or don't include the tooltip.
     */
    tooltip?: string | undefined;

    /** Is the menu item visible? */
    visible?: boolean;
}

/** Returns whether the given object could possibly represent a `MenuItem`. */
export function isMenuItem(object: unknown): object is MenuItem {
    const obj = object as MenuItem;
    if (obj === undefined) return false;

    // A MenuItem must have an id.
    if (obj.id === undefined) return false;

    // A MenuItem must have either a label or a separator.
    if (!obj.separator) {
        if (!obj.label) { return false; }
        if (!obj.execute) { return false; }
    }

    return true;
}

/** Parses the given object into a `ResolvedMenuItem`. */
export function resolveMenuItem(item: MenuItem): ResolvedMenuItem {
    return new ResolvedMenuItem(item);
}

/** Defines and resolves all the properties of a `MenuItem`. */
export class ResolvedMenuItem extends ResolvedKeyBoundCommand implements MenuItem {
    icon = '';
    readonly id: string;
    items: ResolvedMenuItem[] = [];
    label = '';
    separator = false;
    tooltip: string | undefined = undefined;
    visible = true;

    constructor(item?: MenuItem | undefined) {
        super(item);

        if (!item) return;
        validateMenuItemOptions(item);

        this.icon = item.icon ?? '';
        this.id = item.id;
        this.items = item.items?.map(it => new ResolvedMenuItem(it)) ?? [];
        this.label = item.label ?? '';
        this.separator = item.separator ?? false;
        this.tooltip = item.tooltip ?? undefined;
        this.visible = item.visible ?? true;
    }
}

function validateMenuItemOptions(item: MenuItem): void {
    if (!item.id) { throw new ArgumentNullException('menuItem.id'); }

    if (!item.separator) {
        if (!item.label) { throw new ArgumentException('MenuItem must have a label unless it is a separator.'); }
        if (!item.execute) { throw new ArgumentException('MenuItem must have an execute command unless it is a separator.'); }
    }
}
