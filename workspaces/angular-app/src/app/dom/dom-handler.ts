/* eslint-disable unicorn/prefer-dom-node-remove */
/* eslint-disable unicorn/prefer-dom-node-append */

import {
  BrowserInfo,
  Dimensions,
  UserAgent,
  AppendToTarget,
  PositionOffset,
} from "./model";
import { ReferenceHolder } from "./reference-holder";

let calculatedScrollbarWidth: number;

let calculatedScrollbarHeight: number;

let browser: BrowserInfo;

let zindex = 1000;

export function addClass(element: HTMLElement, className: string): void {
  if (element && className) {
    if (element.classList) element.classList.add(className);
    else element.className += " " + className;
  }
}

export function addMultipleClasses(
  element: HTMLElement,
  className: string
): void {
  if (element && className) {
    if (element.classList) {
      const styles: string[] = className.trim().split(" ");
      for (const style of styles) {
        element.classList.add(style);
      }
    } else {
      const styles: string[] = className.split(" ");
      for (const style of styles) {
        element.className += " " + style;
      }
    }
  }
}

export function removeClass(element: Element, className: string): void {
  if (element && className) {
    if (element.classList) element.classList.remove(className);
    else
      element.className = element.className.replace(
        new RegExp(
          "(^|\\b)" + className.split(" ").join("|") + "(\\b|$)",
          "gi"
        ),
        " "
      );
  }
}

export function hasClass(element: Element, className: string): boolean {
  if (element && className) {
    return element.classList
      ? element.classList.contains(className)
      : new RegExp("(^| )" + className + "( |$)", "gi").test(element.className);
  }

  return false;
}

export function siblings(element: Node): Node[] {
  return Array.prototype.filter.call(
    element.parentNode?.children,
    function (child: Node) {
      return child !== element;
    }
  );
}

export function find(element: Element, selector: string): HTMLElement[] {
  return Array.from(element.querySelectorAll<HTMLElement>(selector));
}

export function findSingle(
  element: Element,
  selector: string
): HTMLElement | null {
  if (element) {
    return element.querySelector(selector);
  }
  return null;
}

export function index(element: Element): number {
  const children = element.parentNode?.childNodes;
  if (!children?.length) return -1;

  let number_ = 0;
  for (let index_ = 0; index_ < children.length; index_++) {
    if (children[index_] == element) return number_;
    if (children[index_].nodeType == 1) number_++;
  }
  return -1;
}

export function indexWithinGroup(
  element: Element,
  attributeName: string
): number {
  if (!element?.parentNode) return -1;

  const children: NodeListOf<ChildNode> = element.parentNode.childNodes;
  if (!children?.length) return -1;

  let number_ = 0;

  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    if (child == element) return number_;
    if (
      (child as Element).attributes &&
      (child as Element).attributes.hasOwnProperty(attributeName) &&
      child.nodeType == 1
    )
      number_++;
  }
  return -1;
}

export function appendOverlay(
  overlay: HTMLElement,
  target: HTMLElement,
  appendTo: AppendToTarget = "self"
) {
  if (appendTo !== "self" && overlay && target) {
    appendChild(overlay, target);
  }
}

export function alignOverlay(
  overlay: HTMLElement,
  target: HTMLElement,
  appendTo: AppendToTarget = "self",
  calculateMinWidth = true
) {
  if (overlay && target) {
    calculateMinWidth &&
      (overlay.style.minWidth ||
        (overlay.style.minWidth = getOuterWidth(target) + "px"));

    if (appendTo === "self") {
      relativePosition(overlay, target);
    } else {
      absolutePosition(overlay, target);
    }
  }
}

function getClosestRelativeElement(
  element: Element | null
): Element | undefined {
  if (!element) return undefined;

  return getComputedStyle(element).getPropertyValue("position") === "relative"
    ? element
    : getClosestRelativeElement(element.parentElement);
}

export function relativePosition(
  element: HTMLElement,
  target: HTMLElement
): void {
  const elementDimensions = element.offsetParent
    ? { width: element.offsetWidth, height: element.offsetHeight }
    : getHiddenElementDimensions(element);
  const targetHeight = target.offsetHeight;
  const targetOffset = target.getBoundingClientRect();
  const windowScrollTop = getWindowScrollTop();
  const windowScrollLeft = getWindowScrollLeft();
  const viewport = getViewport();
  const relativeElement = getClosestRelativeElement(element);
  const relativeElementOffset = relativeElement?.getBoundingClientRect() || {
    top: -1 * windowScrollTop,
    left: -1 * windowScrollLeft,
  };
  let top: number, left: number;

  if (
    targetOffset.top + targetHeight + elementDimensions.height >
    viewport.height
  ) {
    top =
      targetOffset.top - relativeElementOffset.top - elementDimensions.height;
    element.style.transformOrigin = "bottom";
    if (targetOffset.top + top < 0) {
      top = -1 * targetOffset.top;
    }
  } else {
    top = targetHeight + targetOffset.top - relativeElementOffset.top;
    element.style.transformOrigin = "top";
  }

  if (elementDimensions.width > viewport.width) {
    // element wider then viewport and cannot fit on screen (align at left side of viewport)
    left = (targetOffset.left - relativeElementOffset.left) * -1;
  } else if (
    targetOffset.left - relativeElementOffset.left + elementDimensions.width >
    viewport.width
  ) {
    // element wider then viewport but can be fit on screen (align at right side of viewport)
    left =
      (targetOffset.left -
        relativeElementOffset.left +
        elementDimensions.width -
        viewport.width) *
      -1;
  } else {
    // element fits on screen (align with target)
    left = targetOffset.left - relativeElementOffset.left;
  }

  element.style.top = top + "px";
  element.style.left = left + "px";
}

export function absolutePosition(
  element: HTMLElement,
  target: HTMLElement
): void {
  const elementDimensions = element.offsetParent
    ? { width: element.offsetWidth, height: element.offsetHeight }
    : getHiddenElementDimensions(element);
  const elementOuterHeight = elementDimensions.height;
  const elementOuterWidth = elementDimensions.width;
  const targetOuterHeight = target.offsetHeight;
  const targetOuterWidth = target.offsetWidth;
  const targetOffset = target.getBoundingClientRect();
  const windowScrollTop = getWindowScrollTop();
  const windowScrollLeft = getWindowScrollLeft();
  const viewport = getViewport();
  let top: number;

  if (
    targetOffset.top + targetOuterHeight + elementOuterHeight >
    viewport.height
  ) {
    top = targetOffset.top + windowScrollTop - elementOuterHeight;
    element.style.transformOrigin = "bottom";

    if (top < 0) {
      top = windowScrollTop;
    }
  } else {
    top = targetOuterHeight + targetOffset.top + windowScrollTop;
    element.style.transformOrigin = "top";
  }

  const left =
    targetOffset.left + elementOuterWidth > viewport.width
      ? Math.max(
          0,
          targetOffset.left +
            windowScrollLeft +
            targetOuterWidth -
            elementOuterWidth
        )
      : targetOffset.left + windowScrollLeft;

  element.style.top = top + "px";
  element.style.left = left + "px";
}

function getParents(element: Node, parents: HTMLElement[] = []): HTMLElement[] {
  return element["parentNode"] === null
    ? parents
    : getParents(element.parentNode, [
        ...parents,
        element.parentNode as HTMLElement,
      ]);
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export function getScrollableParents<T extends Node>(
  element: T | undefined
): HTMLElement[] {
  const scrollableParents: HTMLElement[] = [];

  if (element) {
    const parents = getParents(element);
    const overflowRegex = /(auto|scroll)/;
    const overflowCheck = (node: Element) => {
      const styleDeclaration = window["getComputedStyle"](node);
      return (
        overflowRegex.test(styleDeclaration.getPropertyValue("overflow")) ||
        overflowRegex.test(styleDeclaration.getPropertyValue("overflowX")) ||
        overflowRegex.test(styleDeclaration.getPropertyValue("overflowY"))
      );
    };

    for (const parent of parents) {
      const scrollSelectors =
        parent.nodeType === 1 && parent.dataset["scrollselectors"];
      if (scrollSelectors) {
        const selectors = scrollSelectors.split(",");
        for (const selector of selectors) {
          const element_ = findSingle(parent, selector);
          if (element_ && overflowCheck(element_)) {
            scrollableParents.push(element_);
          }
        }
      }

      if (parent.nodeType !== 9 && overflowCheck(parent)) {
        scrollableParents.push(parent);
      }
    }
  }

  return scrollableParents;
}

export function getHiddenElementOuterHeight(element: HTMLElement): number {
  element.style.visibility = "hidden";
  element.style.display = "block";
  const elementHeight = element.offsetHeight;
  element.style.display = "none";
  element.style.visibility = "visible";

  return elementHeight;
}

export function getHiddenElementOuterWidth(element: HTMLElement): number {
  element.style.visibility = "hidden";
  element.style.display = "block";
  const elementWidth = element.offsetWidth;
  element.style.display = "none";
  element.style.visibility = "visible";

  return elementWidth;
}

export function getHiddenElementDimensions(element: HTMLElement): Dimensions {
  const dimensions: Dimensions = { width: -1, height: -1 };
  element.style.visibility = "hidden";
  element.style.display = "block";
  dimensions.width = element.offsetWidth;
  dimensions.height = element.offsetHeight;
  element.style.display = "none";
  element.style.visibility = "visible";

  return dimensions;
}

export function scrollInView(container: Element, item: HTMLElement): void {
  const borderTopValue: string =
    getComputedStyle(container).getPropertyValue("borderTopWidth");
  const borderTop: number = borderTopValue
    ? Number.parseFloat(borderTopValue)
    : 0;
  const paddingTopValue: string =
    getComputedStyle(container).getPropertyValue("paddingTop");
  const paddingTop: number = paddingTopValue
    ? Number.parseFloat(paddingTopValue)
    : 0;
  const containerRect = container.getBoundingClientRect();
  const itemRect = item.getBoundingClientRect();
  const offset =
    itemRect.top +
    document.body.scrollTop -
    (containerRect.top + document.body.scrollTop) -
    borderTop -
    paddingTop;
  const scroll = container.scrollTop;
  const elementHeight = container.clientHeight;
  const itemHeight = getOuterHeight(item);

  if (offset < 0) {
    container.scrollTop = scroll + offset;
  } else if (offset + itemHeight > elementHeight) {
    container.scrollTop = scroll + offset - elementHeight + itemHeight;
  }
}

export function fadeIn(
  element: HTMLElement | undefined,
  duration: number
): void {
  if (!element) return;

  element.style.opacity = "0";

  let last = +Date.now();
  let opacity = 0;
  const tick = function () {
    opacity =
      +element.style.opacity.replace(",", ".") + (Date.now() - last) / duration;
    element.style.opacity = opacity.toString();
    last = Date.now();

    if (+opacity < 1) {
      requestAnimationFrame(tick) || setTimeout(tick, 16);
    }
  };

  tick();
}

export function fadeOut(element: HTMLElement, ms: number): void {
  let opacity = 1;
  const interval = 50,
    duration = ms,
    gap = interval / duration;

  const fading = setInterval(() => {
    opacity = opacity - gap;

    if (opacity <= 0) {
      opacity = 0;
      clearInterval(fading);
    }

    element.style.opacity = opacity.toString();
  }, interval);
}

export function getWindowScrollTop(): number {
  const documentElement = document.documentElement;
  return (
    (window.pageYOffset || documentElement.scrollTop) -
    (documentElement.clientTop || 0)
  );
}

export function getWindowScrollLeft(): number {
  const documentElement = document.documentElement;
  return (
    (window.pageXOffset || documentElement.scrollLeft) -
    (documentElement.clientLeft || 0)
  );
}

export function matches<T extends Element>(
  element: T,
  selector: string
): boolean {
  return element.matches(selector);
}

export function getOuterWidth(element: HTMLElement, margin?: number): number {
  let width = element.offsetWidth;
  if (margin !== undefined) {
    const style = getComputedStyle(element);
    width +=
      Number.parseFloat(style.marginLeft) +
      Number.parseFloat(style.marginRight);
  }

  return width;
}

export function getHorizontalPadding(element: HTMLElement): number {
  const style = getComputedStyle(element);
  return (
    Number.parseFloat(style.paddingLeft) + Number.parseFloat(style.paddingRight)
  );
}

export function getHorizontalMargin(element: HTMLElement): number {
  const style = getComputedStyle(element);
  return (
    Number.parseFloat(style.marginLeft) + Number.parseFloat(style.marginRight)
  );
}

export function innerWidth(element: HTMLElement): number {
  let width = element.offsetWidth;
  const style = getComputedStyle(element);

  width +=
    Number.parseFloat(style.paddingLeft) +
    Number.parseFloat(style.paddingRight);
  return width;
}

export function width(element: HTMLElement): number {
  let width = element.offsetWidth;
  const style = getComputedStyle(element);

  width -=
    Number.parseFloat(style.paddingLeft) +
    Number.parseFloat(style.paddingRight);
  return width;
}

export function getInnerHeight(element: HTMLElement): number {
  let height = element.offsetHeight;
  const style = getComputedStyle(element);

  height +=
    Number.parseFloat(style.paddingTop) +
    Number.parseFloat(style.paddingBottom);
  return height;
}

export function getOuterHeight(element: HTMLElement, margin?: number): number {
  let height = element.offsetHeight;

  if (margin) {
    const style = getComputedStyle(element);
    height +=
      Number.parseFloat(style.marginTop) +
      Number.parseFloat(style.marginBottom);
  }

  return height;
}

export function getHeight(element: HTMLElement): number {
  let height = element.offsetHeight;
  const style = getComputedStyle(element);

  height -=
    Number.parseFloat(style.paddingTop) +
    Number.parseFloat(style.paddingBottom) +
    Number.parseFloat(style.borderTopWidth) +
    Number.parseFloat(style.borderBottomWidth);

  return height;
}

export function getWidth(element: HTMLElement): number {
  let width = element.offsetWidth;
  const style = getComputedStyle(element);

  width -=
    Number.parseFloat(style.paddingLeft) +
    Number.parseFloat(style.paddingRight) +
    Number.parseFloat(style.borderLeftWidth) +
    Number.parseFloat(style.borderRightWidth);

  return width;
}

export function getViewport(): Dimensions {
  const win = window,
    d = document,
    documentElement = d.documentElement,
    g = documentElement.querySelectorAll("body")[0],
    w = win.innerWidth || documentElement.clientWidth || g.clientWidth,
    h = win.innerHeight || documentElement.clientHeight || g.clientHeight;

  return { width: w, height: h };
}

export function getOffset(element: HTMLElement): PositionOffset {
  const rect = element.getBoundingClientRect();

  return {
    top:
      rect.top +
      (window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0),
    left:
      rect.left +
      (window.pageXOffset ||
        document.documentElement.scrollLeft ||
        document.body.scrollLeft ||
        0),
  };
}

export function replaceElementWith(
  element: Element,
  replacementElement: Node
): Element {
  const parentNode = element.parentNode;
  if (!parentNode) throw `Can't replace element`;
  element.replaceWith(replacementElement);
  return element;
}

export function getUserAgent(): string {
  return navigator.userAgent;
}

export function isIE(): boolean {
  const ua = window.navigator.userAgent;

  const msie = ua.indexOf("MSIE ");
  if (msie > 0) {
    // IE 10 or older => return version number
    return true;
  }

  const trident = ua.indexOf("Trident/");
  if (trident > 0) {
    // IE 11 => return version number
    // const rv = ua.indexOf('rv:');
    return true;
  }

  const edge = ua.indexOf("Edge/");
  // eslint-disable-next-line sonarjs/prefer-single-boolean-return
  if (edge > 0) {
    // Edge (IE 12+) => return version number
    return true;
  }

  // other browser
  return false;
}

export function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

export function isAndroid() {
  return /(android)/i.test(navigator.userAgent);
}

export function isTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

export function appendChild(element: Node, target: unknown): void {
  if (isHTMLElement(target)) {
    target.appendChild(element);
  } else if (isReferenceHolder(target)) {
    target.element.nativeElement.appendChild(element);
  } else {
    throw "Cannot append " + target + " to " + element;
  }
}

export function removeChild<T extends Node>(element: T, target: unknown) {
  if (isHTMLElement(target)) {
    target.removeChild(element);
  } else if (isReferenceHolder(target)) {
    target.element.nativeElement.removeChild(element);
  } else {
    throw "Cannot remove " + element + " from " + target;
  }
}

export function removeElement<T extends Element>(element: T) {
  element.remove();
}

export function isHTMLElement(object: unknown): object is HTMLElement {
  return (
    object !== null && object !== undefined && object instanceof HTMLElement
  );
}

export function isReferenceHolder(object: unknown): object is ReferenceHolder {
  return (
    object !== null && object !== undefined && object instanceof ReferenceHolder
  );
}

export function calculateScrollbarWidth(element?: HTMLElement): number {
  if (element) {
    const style = getComputedStyle(element);
    return (
      element.offsetWidth -
      element.clientWidth -
      Number.parseFloat(style.borderLeftWidth) -
      Number.parseFloat(style.borderRightWidth)
    );
  } else {
    if (calculatedScrollbarWidth != null) return calculatedScrollbarWidth;

    const scrollDiv = document.createElement("div");
    scrollDiv.className = "p-scrollbar-measure";
    document.body.appendChild(scrollDiv);

    const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);

    calculatedScrollbarWidth = scrollbarWidth;

    return scrollbarWidth;
  }
}

export function calculateScrollbarHeight(): number {
  if (calculatedScrollbarHeight != null) return calculatedScrollbarHeight;

  const scrollDiv = document.createElement("div");
  scrollDiv.className = "p-scrollbar-measure";
  document.body.appendChild(scrollDiv);

  const scrollbarHeight = scrollDiv.offsetHeight - scrollDiv.clientHeight;
  document.body.removeChild(scrollDiv);

  calculatedScrollbarHeight = scrollbarHeight;

  return scrollbarHeight;
}

export function invokeElementMethod(
  element: Element,
  methodName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  arguments_?: any[]
): void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (element as any)[methodName].apply(element, arguments_);
}

export function clearSelection(): void {
  const selection: Selection | null = window.getSelection();
  if (!selection) return;
  selection.empty();
}

export function getBrowser(): BrowserInfo {
  if (!browser) {
    const matched = resolveUserAgent();
    browser = {};

    if (matched.browser) {
      browser[matched.browser] = true;
      browser["version"] = matched.version;
    }

    if (browser.chrome) {
      browser.webkit = true;
    } else if (browser.webkit) {
      browser.safari = true;
    }
  }

  return browser;
}

export function resolveUserAgent(): UserAgent {
  const ua = navigator.userAgent.toLowerCase();
  const match =
    /(chrome)[ /]([\w.]+)/.exec(ua) ||
    /(webkit)[ /]([\w.]+)/.exec(ua) ||
    /(opera)(?:.*version|)[ /]([\w.]+)/.exec(ua) ||
    /(msie) ([\w.]+)/.exec(ua) ||
    (!ua.includes("compatible") && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua)) ||
    [];

  return {
    browser: match[1] || "",
    version: match[2] || "0",
  };
}

export function isInteger(value: unknown): boolean {
  return Number.isInteger
    ? Number.isInteger(value)
    : typeof value === "number" &&
        Number.isFinite(value) &&
        Math.floor(value) === value;
}

export function isHidden(element: HTMLElement): boolean {
  return !element || element.offsetParent === null;
}

export function isVisible(element: HTMLElement): boolean {
  return element && element.offsetParent != undefined;
}

export function isExist<TElement extends Element>(element: TElement): boolean {
  return element != null && !!element.nodeName && !!element.parentNode;
}

export function focus(element: HTMLElement, options?: FocusOptions): void {
  element && document.activeElement !== element && element.focus(options);
}

export function getFocusableElements(element: Element): Element[] {
  const focusableElements = find(
    element,
    `button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden]),
                [href]:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden]),
                input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden]), select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden]),
                textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden]), [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden]),
                [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden]):not(.p-disabled)`
  );

  const visibleFocusableElements: HTMLElement[] = [];
  for (const focusableElement of focusableElements) {
    if (
      !!(
        focusableElement.offsetWidth ||
        focusableElement.offsetHeight ||
        focusableElement.getClientRects().length > 0
      )
    )
      visibleFocusableElements.push(focusableElement);
  }
  return visibleFocusableElements;
}

export function getNextFocusableElement(
  element: HTMLElement,
  reverse = false
): Element {
  const focusableElements = getFocusableElements(element);
  let index = 0;
  if (focusableElements && focusableElements.length > 0) {
    const firstFocused: Element | null =
      focusableElements[0].ownerDocument.activeElement;
    const focusedIndex = firstFocused
      ? focusableElements.indexOf(firstFocused)
      : 0;

    if (reverse) {
      index =
        focusedIndex == -1 || focusedIndex === 0
          ? focusableElements.length - 1
          : focusedIndex - 1;
    } else if (
      focusedIndex != -1 &&
      focusedIndex !== focusableElements.length - 1
    ) {
      index = focusedIndex + 1;
    }
  }

  return focusableElements[index];
}

export function generateZIndex() {
  zindex = zindex || 999;
  return ++zindex;
}

export function getSelection(): string | undefined {
  const selection: Selection | null = window.getSelection();
  return selection?.toString();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any, sonarjs/cognitive-complexity
export function getTargetElement<T extends HTMLElement>(
  target: any,
  element?: T
): any {
  if (!target) return undefined;

  switch (target) {
    case "document": {
      return document;
    }
    case "window": {
      return window;
    }
    case "@next": {
      return element?.nextElementSibling;
    }
    case "@prev": {
      return element?.previousElementSibling;
    }
    case "@parent": {
      return element?.parentElement;
    }
    case "@grandparent": {
      return element?.parentElement?.parentElement;
    }
    default: {
      const type = typeof target;

      if (type === "string") {
        return document.querySelector(target);
      } else if (type === "object" && target.hasOwnProperty("nativeElement")) {
        return isExist(target.nativeElement) ? target.nativeElement : undefined;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const isFunction = (object: any) =>
        !!(object && object.constructor && object.call && object.apply);
      const element = isFunction(target) ? target() : target;

      return (element && element.nodeType === 9) || isExist(element)
        ? element
        : undefined;
    }
  }
}
