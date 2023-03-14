import { TooltipOptions } from "../tooltips";

export interface Menu {
  /** An array of menu items. */
  model?: MenuItem[];

  /** Defines if menu would displayed as a popup.
   * @default false
   */
  popup?: boolean;

  /** Inline style of the component. */
  style?: string;

  /** Style class of the component. */
  styleClass?: string;

  /** Base zIndex value to use in layering.
   * @default 0
   */
  zIndex?: number;

  /** Whether to automatically manage layering.
   * @default true
   */
  autoZIndex?: boolean;

  /** Transition options of the show animation.
   * @default '.12s cubic-bezier(0, 0, 0.2, 1)'
   */
  showTransitionOptions?: string;

  /** Transition options of the hide animation.
   * @default '.1s linear'
   */
  hideTransitionOptions?: string;

  /** Callback to invoke when overlay menu is shown. */
  onShow?: (event?: Event) => void;

  /** Callback to invoke when overlay menu is hidden. */
  onHide?: (event?: Event) => void;
}

export interface MenuItemEvent {
  /** The browser event. */
  originalEvent: Event;

  /** The MenuItem metadata. */
  item: MenuItem;
}

export interface MenuItem {
  automationId?: string;

  /** Value of the badge. */
  badge?: string;

  /**	Style class of the badge. */
  badgeStyleClass?: string;

  /** Callback to execute when item is clicked. */
  command?: (event?: MenuItemEvent) => void;

  /** When set as true, disables the menuitem.
   * @default false
   */
  disabled?: boolean;

  /** Whether to escape the label or not. Set to false to display html content.
   * @default true
   */
  escape?: boolean;

  /** Visibility of submenu.
   * @default false
   */
  expanded?: boolean;

  /** Icon of the item. */
  icon?: string;

  /** Inline style of the item's icon. */
  iconStyle?: { [klass: string]: any } | null;

  /** Identifier of the element. */
  id?: string;

  /** An array of children menuitems. */
  items?: MenuItem[];

  /** Text of the item. */
  label?: string;

  /** Defines the item as a separator.
   * @default false
   */
  separator?: boolean;

  /**	Inline style of the menuitem. */
  style?: { [klass: string]: any } | null;

  /**	Style class of the menuitem. */
  styleClass?: string;

  /** Specifies tab order of the item.
   * @default 0
   */
  tabindex?: string;

  /** The item's tooltip. */
  tooltip?: string | TooltipOptions;

  /** Whether the dom element of menuitem is created or not.
   * @default true
   */
  visible?: boolean;
}
