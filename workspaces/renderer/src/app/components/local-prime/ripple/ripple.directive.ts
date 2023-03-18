import {
  Directive,
  AfterViewInit,
  ElementRef,
  NgZone,
  OnDestroy,
} from "@angular/core";
import {
  addClass,
  getHeight,
  getOffset,
  getOuterHeight,
  getOuterWidth,
  getWidth,
  removeClass,
  removeElement,
} from "../dom";

const config = { ripple: false };
const INK_ACTIVE = "p-ink-active";

@Directive({
  selector: "[pRipple]",
  host: {
    class: "p-ripple p-element",
  },
})
export class RippleDirective implements AfterViewInit, OnDestroy {
  constructor(public element: ElementRef, public zone: NgZone) {}

  animationListener:
    | ((this: HTMLElement, event: AnimationEvent) => any)
    | undefined;

  mouseDownListener:
    | ((this: HTMLElement, event: MouseEvent) => void)
    | undefined;

  timeout: NodeJS.Timeout | undefined;

  ngAfterViewInit() {
    if (config && config.ripple) {
      this.zone.runOutsideAngular(() => {
        this.create();

        this.mouseDownListener = this.onMouseDown.bind(this);
        this.element.nativeElement.addEventListener(
          "mousedown",
          this.mouseDownListener
        );
      });
    }
  }

  onMouseDown(event: MouseEvent) {
    const ink = this.getInk();
    if (!ink || getComputedStyle(ink).display === "none") {
      return;
    }

    removeClass(ink, INK_ACTIVE);
    if (!getHeight(ink) && !getWidth(ink)) {
      const maxDimension = Math.max(
        getOuterWidth(this.element.nativeElement),
        getOuterHeight(this.element.nativeElement)
      );
      ink.style.height = maxDimension + "px";
      ink.style.width = maxDimension + "px";
    }

    const offset = getOffset(this.element.nativeElement);
    const x =
      event.pageX - offset.left + document.body.scrollTop - getWidth(ink) / 2;
    const y =
      event.pageY - offset.top + document.body.scrollLeft - getHeight(ink) / 2;

    ink.style.top = y + "px";
    ink.style.left = x + "px";
    addClass(ink, INK_ACTIVE);

    this.timeout = setTimeout(() => {
      const ink = this.getInk();
      if (ink) {
        removeClass(ink, INK_ACTIVE);
      }
    }, 401);
  }

  getInk(): HTMLElement | undefined {
    const children = this.element.nativeElement.children;
    for (let index = 0; index < children.length; index++) {
      if (
        typeof children[index].className === "string" &&
        children[index].className.includes("p-ink")
      ) {
        return children[index];
      }
    }
    return undefined;
  }

  resetInk(): void {
    const ink = this.getInk();
    if (ink) {
      removeClass(ink, INK_ACTIVE);
    }
  }

  onAnimationEnd(event: Event): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    const element = event.currentTarget as Element;
    removeClass(element, INK_ACTIVE);
  }

  create(): void {
    const ink = document.createElement("span");
    ink.className = "p-ink";
    this.element.nativeElement.append(ink);

    this.animationListener = this.onAnimationEnd.bind(this);
    ink.addEventListener("animationend", this.animationListener);
  }

  remove(): void {
    const ink = this.getInk();
    if (ink) {
      if (this.mouseDownListener) {
        this.element.nativeElement.removeEventListener(
          "mousedown",
          this.mouseDownListener
        );
      }
      if (this.animationListener) {
        ink.removeEventListener("animationend", this.animationListener);
      }
      removeElement(ink);
    }
  }

  ngOnDestroy() {
    if (config && config.ripple) {
      this.remove();
    }
  }
}
