import {
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  Renderer2,
  SimpleChanges,
} from "@angular/core";
import { zIndices } from "../../config";
import {
  appendChild,
  clearZIndex,
  ConnectedOverlayScrollHandler,
  fadeIn,
  findSingle,
  getOuterHeight,
  getOuterWidth,
  getViewport,
  getWindowScrollLeft,
  getWindowScrollTop,
  hasClass,
  removeChild,
  setZIndex,
  ReferenceHolder,
  AppendToTarget,
  PositionOffset,
} from "../../dom";
import { TooltipEvent, TooltipOptions, TooltipPosition } from "./model";
import { ResolvedTooltipOptions, resolveTooltipOptions } from "./resolvers";

@Directive({
  selector: "[tooltip]",
  host: {
    class: "ef-element",
  },
})
export class TooltipDirective
  extends ReferenceHolder
  implements AfterViewInit, OnDestroy
{
  @Input() position: string;

  @Input() tooltipEvent: string;

  @Input() appendTo: unknown;

  @Input() positionStyle: string;

  @Input() tooltipStyleClass: string;

  @Input() tooltipZIndex: string;

  @Input() escape = true;

  @Input() showDelay: number;

  @Input() hideDelay: number;

  @Input() life: number;

  @Input() positionTop: number;

  @Input() positionLeft: number;

  @Input() autoHide = true;

  @Input() fitContent = true;

  @Input("tooltip") text: string;

  @Input("tooltipDisabled") get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = value;
    this.deactivate();
  }
  _disabled = false;

  @Input() get tooltipOptions(): ResolvedTooltipOptions {
    return this._options;
  }
  set tooltipOptions(value: TooltipOptions | string) {
    this._options = resolveTooltipOptions(value);
  }
  _options: ResolvedTooltipOptions = new ResolvedTooltipOptions();

  container: HTMLElement | undefined;

  styleClass: string;

  tooltipText: HTMLDivElement;

  showTimeout: NodeJS.Timeout | undefined;

  hideTimeout: NodeJS.Timeout | undefined;

  active = true;

  mouseEnterListener:
    | ((this: HTMLElement, event: MouseEvent) => void)
    | undefined;

  mouseLeaveListener:
    | ((this: HTMLElement, event: MouseEvent) => void)
    | undefined;

  containerMouseleaveListener: ((event: Event) => void) | undefined;

  clickListener: ((this: HTMLElement, event: MouseEvent) => void) | undefined;

  focusListener: ((this: HTMLElement, event: FocusEvent) => void) | undefined;

  blurListener: ((this: HTMLElement, event: FocusEvent) => void) | undefined;

  scrollHandler: ConnectedOverlayScrollHandler | undefined;

  resizeListener: ((this: Window, event: UIEvent) => any) | undefined;

  constructor(
    element: ElementRef,
    public zone: NgZone,
    private renderer: Renderer2,
    private changeDetector: ChangeDetectorRef
  ) {
    super(element);
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      const event: TooltipEvent = this.getOption("tooltipEvent");
      if (event === "hover") {
        this.mouseEnterListener = this.onMouseEnter.bind(this);
        this.mouseLeaveListener = this.onMouseLeave.bind(this);
        this.clickListener = this.onInputClick.bind(this);
        const element: HTMLElement = this.element.nativeElement;
        element.addEventListener("mouseenter", this.mouseEnterListener);
        element.addEventListener("click", this.clickListener);
        element.addEventListener("mouseleave", this.mouseLeaveListener);
      } else if (event === "focus") {
        this.focusListener = this.onFocus.bind(this);
        this.blurListener = this.onBlur.bind(this);
        const target: HTMLElement = this.getTarget(this.element.nativeElement);
        target.addEventListener("focus", this.focusListener);
        target.addEventListener("blur", this.blurListener);
      }
    });
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  ngOnChanges(simpleChange: SimpleChanges): void {
    if (simpleChange.tooltipPosition) {
      this.setOption({
        tooltipPosition: simpleChange.tooltipPosition.currentValue,
      });
    }

    if (simpleChange.tooltipEvent) {
      this.setOption({
        tooltipEvent: simpleChange.tooltipEvent.currentValue,
      });
    }

    if (simpleChange.appendTo) {
      this.setOption({ appendTo: simpleChange.appendTo.currentValue });
    }

    if (simpleChange.positionStyle) {
      this.setOption({
        positionStyle: simpleChange.positionStyle.currentValue,
      });
    }

    if (simpleChange.tooltipStyleClass) {
      this.setOption({
        tooltipStyleClass: simpleChange.tooltipStyleClass.currentValue,
      });
    }

    if (simpleChange.zIndex) {
      this.setOption({
        zIndex: simpleChange.zIndex.currentValue,
      });
    }

    if (simpleChange.escape) {
      this.setOption({ escape: simpleChange.escape.currentValue });
    }

    if (simpleChange.showDelay) {
      this.setOption({ showDelay: simpleChange.showDelay.currentValue });
    }

    if (simpleChange.hideDelay) {
      this.setOption({ hideDelay: simpleChange.hideDelay.currentValue });
    }

    if (simpleChange.life) {
      this.setOption({ life: simpleChange.life.currentValue });
    }

    if (simpleChange.position) {
      this.setOption({ position: simpleChange.position.currentValue });
    }

    if (simpleChange.disabled) {
      this.setOption({ disabled: simpleChange.disabled.currentValue });
    }

    if (simpleChange.text) {
      this.setOption({ label: simpleChange.text.currentValue });

      if (this.active) {
        if (simpleChange.text.currentValue) {
          if (this.container && this.container.offsetParent) {
            this.updateText();
            this.align();
          } else {
            this.show();
          }
        } else {
          this.hide();
        }
      }
    }

    if (simpleChange.autoHide) {
      this.setOption({ autoHide: simpleChange.autoHide.currentValue });
    }

    if (simpleChange.tooltipOptions) {
      this._options = resolveTooltipOptions(
        simpleChange.tooltipOptions.currentValue
      );
      this.deactivate();

      if (this.active) {
        const label: string = this.getOption("label");
        if (label) {
          if (this.container && this.container.offsetParent) {
            this.updateText();
            this.align();
          } else {
            this.show();
          }
        } else {
          this.hide();
        }
      }
    }
  }

  isAutoHide(): boolean {
    return this.getOption("autoHide");
  }

  onMouseEnter(_: Event): void {
    if (!this.container && !this.showTimeout) {
      this.activate();
    }
  }

  onMouseLeave(event: MouseEvent): void {
    if (this.isAutoHide()) {
      this.deactivate();
    } else {
      const valid =
        hasClass(event.relatedTarget as Element, "p-tooltip") ||
        hasClass(event.relatedTarget as Element, "p-tooltip-arrow") ||
        hasClass(event.relatedTarget as Element, "p-tooltip-text") ||
        hasClass(event.relatedTarget as Element, "p-tooltip");
      !valid && this.deactivate();
    }
  }

  onFocus(_: Event): void {
    this.activate();
  }

  onBlur(_: Event): void {
    this.deactivate();
  }

  onInputClick(_: Event): void {
    this.deactivate();
  }

  activate(): void {
    this.active = true;
    this.clearHideTimeout();

    if (this.getOption("showDelay"))
      this.showTimeout = setTimeout(() => {
        this.show();
      }, this.getOption("showDelay"));
    else this.show();

    const life: number = this.getOption("life");
    if (life != undefined) {
      const showDelay: number = this.getOption("showDelay");
      const duration: number =
        showDelay === undefined ? life : life + showDelay;
      this.hideTimeout = setTimeout(() => {
        this.hide();
      }, duration);
    }
  }

  deactivate(): void {
    this.active = false;
    this.clearShowTimeout();

    if (this.getOption("hideDelay")) {
      this.clearHideTimeout(); //life timeout
      this.hideTimeout = setTimeout(() => {
        this.hide();
      }, this.getOption("hideDelay"));
    } else {
      this.hide();
    }
  }

  create(): void {
    if (this.container) {
      this.clearHideTimeout();
      this.remove();
    }

    this.container = document.createElement("div");

    const tooltipArrow = document.createElement("div");
    tooltipArrow.className = "p-tooltip-arrow";
    this.container.append(tooltipArrow);

    this.updateText();

    const appendTo = this.getOption("appendTo");
    if (appendTo === "body") document.body.append(this.container);
    else if (appendTo === "target")
      appendChild(this.container, this.element.nativeElement);
    else appendChild(this.container, appendTo);

    this.container.style.display = "inline-block";

    if (this.fitContent) {
      this.container.style.width = "fit-content";
    }

    if (!this.isAutoHide()) {
      this.bindContainerMouseleaveListener();
    }
  }

  bindContainerMouseleaveListener(): void {
    if (!this.containerMouseleaveListener) {
      const targetElement: HTMLElement =
        this.container ?? this.element.nativeElement;

      this.containerMouseleaveListener = this.renderer.listen(
        targetElement,
        "mouseleave",
        (_) => {
          this.deactivate();
        }
      );
    }
  }

  unbindContainerMouseleaveListener(): void {
    if (this.containerMouseleaveListener) {
      this.bindContainerMouseleaveListener();
      this.containerMouseleaveListener = undefined;
    }
  }

  show(): void {
    if (!this.getOption("label") || this.getOption("disabled")) {
      return;
    }

    this.create();
    this.align();
    fadeIn(this.container, 250);

    if (this.container) {
      const zIndex: string = this.getOption("zIndex");
      if (zIndex === "auto") {
        setZIndex("tooltip", this.container, zIndices.tooltip);
      } else {
        this.container.style.zIndex = zIndex;
      }
    }

    this.bindDocumentResizeListener();
    this.bindScrollListener();
  }

  hide(): void {
    if (this.getOption("zIndex") === "auto") {
      clearZIndex(this.container);
    }

    this.remove();
  }

  updateText(): void {
    if (!this.tooltipText) {
      const div: HTMLDivElement = document.createElement("div");
      div.className = "p-tooltip-text";
      this.tooltipText = div;
    }

    if (this.getOption("escape")) {
      this.tooltipText.innerHTML = "";
      this.tooltipText.append(document.createTextNode(this.getOption("label")));
    } else {
      this.tooltipText.innerHTML = this.getOption("label");
    }

    if (this.container) {
      if (this.getOption("positionStyle")) {
        this.container.style.position = this.getOption("positionStyle");
      }

      this.container.append(this.tooltipText);
    }
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  align(): void {
    const position: TooltipPosition = this.getOption("tooltipPosition");

    switch (position) {
      case "top": {
        this.alignTop();
        if (this.isOutOfBounds()) {
          this.alignBottom();
          if (this.isOutOfBounds()) {
            this.alignRight();

            if (this.isOutOfBounds()) {
              this.alignLeft();
            }
          }
        }
        break;
      }

      case "bottom": {
        this.alignBottom();
        if (this.isOutOfBounds()) {
          this.alignTop();
          if (this.isOutOfBounds()) {
            this.alignRight();

            if (this.isOutOfBounds()) {
              this.alignLeft();
            }
          }
        }
        break;
      }

      case "left": {
        this.alignLeft();
        if (this.isOutOfBounds()) {
          this.alignRight();

          if (this.isOutOfBounds()) {
            this.alignTop();

            if (this.isOutOfBounds()) {
              this.alignBottom();
            }
          }
        }
        break;
      }

      case "right": {
        this.alignRight();
        if (this.isOutOfBounds()) {
          this.alignLeft();

          if (this.isOutOfBounds()) {
            this.alignTop();

            if (this.isOutOfBounds()) {
              this.alignBottom();
            }
          }
        }
        break;
      }
    }
  }

  getHostOffset(): PositionOffset {
    if (
      this.getOption("appendTo") === "body" ||
      this.getOption("appendTo") === "target"
    ) {
      const offset = this.element.nativeElement.getBoundingClientRect();
      const targetLeft = offset.left + getWindowScrollLeft();
      const targetTop = offset.top + getWindowScrollTop();

      return { left: targetLeft, top: targetTop };
    } else {
      return { left: 0, top: 0 };
    }
  }

  alignRight(): void {
    if (!this.container) return;

    this.preAlign("right");
    const hostOffset = this.getHostOffset();
    const left = hostOffset.left + getOuterWidth(this.element.nativeElement);
    const top =
      hostOffset.top +
      (getOuterHeight(this.element.nativeElement) -
        getOuterHeight(this.container)) /
        2;
    const position: PositionOffset = this.getOption("position");
    this.container.style.left = left + position.left + "px";
    this.container.style.top = top + position.top + "px";
  }

  alignLeft(): void {
    if (!this.container) return;

    this.preAlign("left");
    const hostOffset = this.getHostOffset();
    const left = hostOffset.left - getOuterWidth(this.container);
    const top =
      hostOffset.top +
      (getOuterHeight(this.element.nativeElement) -
        getOuterHeight(this.container)) /
        2;
    const position: PositionOffset = this.getOption("position");
    this.container.style.left = left + position.left + "px";
    this.container.style.top = top + position.top + "px";
  }

  alignTop(): void {
    if (!this.container) return;

    this.preAlign("top");
    const hostOffset = this.getHostOffset();
    const left =
      hostOffset.left +
      (getOuterWidth(this.element.nativeElement) -
        getOuterWidth(this.container)) /
        2;
    const top = hostOffset.top - getOuterHeight(this.container);
    const position: PositionOffset = this.getOption("position");
    this.container.style.left = left + position.top + "px";
    this.container.style.top = top + position.left + "px";
  }

  alignBottom(): void {
    if (!this.container) return;

    this.preAlign("bottom");
    const hostOffset = this.getHostOffset();
    const left =
      hostOffset.left +
      (getOuterWidth(this.element.nativeElement) -
        getOuterWidth(this.container)) /
        2;
    const top = hostOffset.top + getOuterHeight(this.element.nativeElement);
    const position: PositionOffset = this.getOption("position");
    this.container.style.left = left + position.left + "px";
    this.container.style.top = top + position.top + "px";
  }

  setOption(option: TooltipOptions): void {
    this._options = { ...this._options, ...option };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getOption<TOut>(option: keyof TooltipOptions): TOut {
    return this._options[option] as TOut;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTarget(element: any): any {
    return hasClass(element, "p-inputwrapper")
      ? findSingle(element, "input")
      : element;
  }

  preAlign(position: string): void {
    if (!this.container) return;

    this.container.style.left = -999 + "px";
    this.container.style.top = -999 + "px";

    const defaultClassName = "p-tooltip p-component p-tooltip-" + position;
    this.container.className = this.getOption("tooltipStyleClass")
      ? defaultClassName + " " + this.getOption("tooltipStyleClass")
      : defaultClassName;
  }

  isOutOfBounds(): boolean {
    if (!this.container) return false;

    const offset = this.container.getBoundingClientRect();
    const targetTop = offset.top;
    const targetLeft = offset.left;
    const width = getOuterWidth(this.container);
    const height = getOuterHeight(this.container);
    const viewport = getViewport();

    return (
      targetLeft + width > viewport.width ||
      targetLeft < 0 ||
      targetTop < 0 ||
      targetTop + height > viewport.height
    );
  }

  onWindowResize(_: Event): void {
    this.hide();
  }

  bindDocumentResizeListener(): void {
    this.zone.runOutsideAngular(() => {
      this.resizeListener = this.onWindowResize.bind(this);
      window.addEventListener("resize", this.resizeListener);
    });
  }

  unbindDocumentResizeListener(): void {
    if (this.resizeListener) {
      window.removeEventListener("resize", this.resizeListener);
      this.resizeListener = undefined;
    }
  }

  bindScrollListener(): void {
    if (!this.scrollHandler) {
      this.scrollHandler = new ConnectedOverlayScrollHandler(
        this.element.nativeElement,
        () => {
          if (this.container) {
            this.hide();
          }
        }
      );
    }

    this.scrollHandler.bindScrollListener();
  }

  unbindScrollListener(): void {
    if (this.scrollHandler) {
      this.scrollHandler.unbindScrollListener();
    }
  }

  unbindEvents(): void {
    if (this.getOption("tooltipEvent") === "hover") {
      this.element.nativeElement.removeEventListener(
        "mouseenter",
        this.mouseEnterListener
      );
      this.element.nativeElement.removeEventListener(
        "mouseleave",
        this.mouseLeaveListener
      );
      this.element.nativeElement.removeEventListener(
        "click",
        this.clickListener
      );
    } else if (this.getOption("tooltipEvent") === "focus") {
      const target = this.getTarget(this.element.nativeElement);

      target.removeEventListener("focus", this.focusListener);
      target.removeEventListener("blur", this.blurListener);
    }

    this.unbindDocumentResizeListener();
  }

  remove(): void {
    if (this.container && this.container.parentElement) {
      const appendTo: AppendToTarget = this.getOption("appendTo");
      if (appendTo === "body") {
        this.container.remove();
        /* document.body.removeChild(this.container); */
      } else if (appendTo === "target") {
        this.container.remove();
        /* this.element.nativeElement.removeChild(this.container); */
      } else {
        removeChild(this.container, this.getOption("appendTo"));
      }
    }

    this.unbindDocumentResizeListener();
    this.unbindScrollListener();
    this.unbindContainerMouseleaveListener();
    this.clearTimeouts();
    this.container = undefined;
    this.scrollHandler = undefined;
  }

  clearShowTimeout(): void {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = undefined;
    }
  }

  clearHideTimeout(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = undefined;
    }
  }

  clearTimeouts(): void {
    this.clearShowTimeout();
    this.clearHideTimeout();
  }

  ngOnDestroy(): void {
    this.unbindEvents();

    if (this.container) {
      clearZIndex(this.container);
    }

    this.remove();

    if (this.scrollHandler) {
      this.scrollHandler.destroy();
      this.scrollHandler = undefined;
    }
  }
}
