import { AppendToTarget, PositionOffset } from "../dom";

export interface TooltipOptions {
  /** Whether to hide tooltip when hovering over tooltip content.
   * @default true */
  autoHide?: boolean;

  /** When present, it specifies that the component should be disabled.
   * @default false
   */
  disabled?: boolean;

  /** By default the tooltip contents are rendered as text. Set to `false` to support html tags in the content.
   * @default true
   */
  escape?: boolean;

  /** Automatically adjusts the element position when there is not enough space on the selected position.
   * @default true
   */
  fitContent?: boolean;

  /** Delay to hide the tooltip in milliseconds. */
  hideDelay?: number;

  /** Text of the tooltip. */
  label?: string;

  /** Time to wait in milliseconds to hide the tooltip even it is active. */
  life?: number;

  /** Type of CSS position.
   * @default absolute
   */
  positionStyle?: PositionStyle;

  /** Delay to show the tooltip in milliseconds. */
  showDelay?: number;

  /** Event to show the tooltip, valid values are `hover` and `focus`.
   * @default hover
   */
  tooltipEvent?: TooltipEvent;

  /** Position of the tooltip, valid values are `right`, `left`, `top` and `bottom`.
   * @default right
   */
  tooltipPosition?: TooltipPosition;

  /** Style class of the tooltip. */
  tooltipStyleClass?: string;

  /** Whether the z-index should be managed automatically to always go on top or have a fixed value. */
  zIndex?: string;

  position?: PositionOffset;

  appendTo?: AppendToTarget;
}

export type PositionStyle =
  | "static"
  | "fixed"
  | "absolute"
  | "relative"
  | "sticky";
export type TooltipEvent = "hover" | "focus";
export type TooltipPosition = "right" | "left" | "top" | "bottom";
