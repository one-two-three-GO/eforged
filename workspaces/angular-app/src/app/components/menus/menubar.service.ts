import { Injectable } from "@angular/core";
import { debounce, filter, interval, Subject } from "rxjs";

@Injectable()
export class MenubarService {
  autoHide: boolean;

  autoHideDelay: number;

  readonly mouseLeaves = new Subject<boolean>();

  readonly mouseLeft$ = this.mouseLeaves.pipe(
    debounce(() => interval(this.autoHideDelay)),
    filter((mouseLeft) => this.autoHide && mouseLeft)
  );
}
