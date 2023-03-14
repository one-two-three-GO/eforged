import { Menu, MenuItem } from "./model";
import {
  ResolvedTooltipOptions,
  resolveTooltipOptions,
} from "../tooltips/resolvers";

export class ResolvedMenuOptions implements Menu {
  model: ResolvedMenuItem[] = [];
  popup = false;
  style: string;
  styleClass: string;
  zIndex = 0;
  autoZIndex = true;
  showTransitionOptions = ".12s cubic-bezier(0, 0, 0.2, 1)";
  hideTransitionOptions = ".1s linear";
  onShow: (event?: Event) => void;
  onHide: (event?: Event) => void;

  /** The original object, before resolution. */
  options: Menu;

  constructor(options?: Menu) {
    if (!options) {
      return;
    }

    Object.assign(this, options);
    this.model = resolveMenuItems(options.model);
  }
}

export class ResolvedMenuItem implements MenuItem {
  automationId: string;
  badge: string;
  badgeStyleClass: string;
  command: (event?: unknown) => void;
  disabled = false;
  escape = true;
  expanded = false;
  icon: string;
  iconStyle: { [klass: string]: any } | null;
  id: string;
  items: ResolvedMenuItem[];
  label: string;
  separator: boolean;
  style: { [klass: string]: any } | null;
  styleClass: string;
  tabindex = "0";
  tooltip: ResolvedTooltipOptions;
  visible = true;

  /** The original object, before resolution. */
  options: MenuItem;

  constructor(options?: MenuItem) {
    if (!options) {
      return;
    }

    Object.assign(this, options);
    this.options = Object.assign({}, options);
    this.items = resolveMenuItems(options.items);
    this.tooltip = resolveTooltipOptions(options.tooltip);
  }
}

/** Resolves all properties of the given `Menu`. */
export function resolveMenu(menu: Menu): ResolvedMenuOptions {
  const result: ResolvedMenuOptions = new ResolvedMenuOptions(menu);
  return result;
}

/** Resolves all properties of the given `MenuItem`. */
export function resolveMenuItem(menuItem: MenuItem): ResolvedMenuItem {
  const result: ResolvedMenuItem = new ResolvedMenuItem(menuItem);
  return result;
}

/** Resolves all properties of the given array of `MenuItem`s. */
export function resolveMenuItems(
  menuItems: MenuItem[] | undefined
): ResolvedMenuItem[] {
  if (!menuItems?.length) {
    return [];
  }

  return menuItems.map((item: MenuItem) => {
    return resolveMenuItem(item);
  });
}
