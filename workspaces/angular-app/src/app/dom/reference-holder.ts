import { ElementRef } from "@angular/core";

export abstract class ReferenceHolder {
  protected constructor(public element: ElementRef) {}
}
