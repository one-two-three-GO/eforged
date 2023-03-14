import { NOOP } from "shared-lib/apis";
import { getScrollableParents } from "./dom-handler";

type Action = (...arguments_: any[]) => void;

export class ConnectedOverlayScrollHandler {
  element: Element | undefined;

  listener: Action | null;

  scrollableParents: Node[] | undefined;

  constructor(element: Element, listener: Action = NOOP) {
    this.element = element;
    this.listener = listener;
  }

  bindScrollListener(): void {
    this.scrollableParents = getScrollableParents(this.element);
    for (let index = 0; index < this.scrollableParents.length; index++) {
      this.scrollableParents[index].addEventListener("scroll", this.listener);
    }
  }

  unbindScrollListener(): void {
    if (this.scrollableParents) {
      for (let index = 0; index < this.scrollableParents.length; index++) {
        this.scrollableParents[index].removeEventListener(
          "scroll",
          this.listener
        );
      }
    }
  }

  destroy(): void {
    this.unbindScrollListener();
    this.element = undefined;
    this.listener = null;
    this.scrollableParents = undefined;
  }
}
