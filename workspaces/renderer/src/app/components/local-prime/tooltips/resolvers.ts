import { AppendToTarget, PositionOffset } from "../dom";
import {
  TooltipOptions,
  PositionStyle,
  TooltipEvent,
  TooltipPosition,
} from "./model";

export class ResolvedTooltipOptions implements TooltipOptions {
  appendTo: AppendToTarget = "body";
  autoHide = true;
  disabled = false;
  escape = true;
  fitContent = true;
  hideDelay: number | undefined = undefined;
  label: string | undefined = "";
  life: number | undefined = undefined;
  position: PositionOffset = { top: 0, left: 0 };
  positionStyle: PositionStyle = "absolute";
  showDelay: number | undefined = undefined;
  tooltipEvent: TooltipEvent = "hover";
  tooltipPosition: TooltipPosition = "right";
  tooltipStyleClass: string | undefined = undefined;
  zIndex: string | undefined = undefined;

  /** The original object, before resolution. */
  options: TooltipOptions | undefined = undefined;

  constructor(options?: TooltipOptions) {
    if (!options) {
      return;
    }

    Object.assign(this, options);
    this.options = options;
  }
}

/** Resolves all properties of a tooltip, given the string or TooltipOptions object. */
export function resolveTooltipOptions(
  input: string | TooltipOptions | undefined
): ResolvedTooltipOptions {
  if (input == null) {
    return new ResolvedTooltipOptions();
  }

  if (typeof input === "string") {
    return resolveTooltipOptions({ label: input });
  }

  const options: TooltipOptions = input;
  const result: ResolvedTooltipOptions = new ResolvedTooltipOptions(options);
  return result;
}
