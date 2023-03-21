import { ArgumentException } from 'common/errors';
import '../dev/CodeValidationExtensions';
import { ArrayChangeArgs, ChangeArgs, Emitter } from '../events';
import { Disposable } from '../lifecycle';
import { isMenuItem, MenuItem, ResolvedMenuItem, resolveMenuItem } from './MenuItem';

/* Everything should be optional on these interfaces,
because they are meant to be used by clients as json objects,
and then resolved to classes by code. */

/** Defines the properties that a `Menu` can have. */
export interface Menu {
    /** The id of the menu. */
    readonly id?: string;

    /** Menu sub-items. */
    items?: MenuItem[];

    /** Whether the menu is enabled or not. */
    isEnabled?: (...args: any[]) => boolean;
}

/** Returns whether the given object could possibly represent a `Menu`. */
export function isMenu(object: unknown): object is Menu {
    // a Menu is meant to be used by clients as a json object, and then resolved to a class.
    // Thus, it doesn't require any configuration.
    return (object as Menu !== undefined);
}

/** Parses the given object into a `ResolvedMenu`. */
export function resolveMenu(item: Menu): ResolvedMenu {
    return new ResolvedMenu(item);
}

export type MenuChangedArgs = ChangeArgs<Menu> & ArrayChangeArgs<MenuItem>;

/** A `Menu` with all its properties resolved. */
export class ResolvedMenu extends Disposable implements Menu {

    public readonly changed: Emitter<MenuChangedArgs> = new Emitter();

    /** The id of the menu. */
    public readonly id: string;

    /** Whether the menu is enabled or not. */
    isEnabled = () => { return true; }

    /** Menu sub-items. */
    public items: ResolvedMenuItem[] = [];
    
    constructor(id: string);
    constructor(options: Menu);
    constructor(idOrOptions: string | Menu) {
        super();
        Object.throwIfNullOrUndefined(idOrOptions, 'idOrOptions');

        this.changed = this._register(new Emitter<MenuChangedArgs>());
        this.id = getId(idOrOptions);
        if (typeof idOrOptions === 'string') { return; }

        this.addRange(idOrOptions.items || []);
    }

    /** Adds a child MenuItem to the Menu. */
    add(item: MenuItem): Menu {
        // resolve the items
        if (isMenuItem(item)) {
            this.items.push(resolveMenuItem(item));
        } else {
            throw new ArgumentException('Could not parse MenuItem.');
        }

        this.changed.emit({
            items: this.items,
            added: [item]
        });

        return this;
    }

    /** Adds a set of MenuItems to the Menu. */
    addRange(items: MenuItem[]): Menu {
        if (!(items && items.length > 0)) {
            return this;
        }

        for (const item of items) this.add(item);

        this.changed.emit({
            items: this.items,
            added: items
        });

        return this;
    }
}

function getId(idOrOptions: string | Menu): string {
    return typeof idOrOptions === 'string' ? idOrOptions : idOrOptions.id || 'main';
}
