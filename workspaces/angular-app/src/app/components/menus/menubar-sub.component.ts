import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewEncapsulation,
} from "@angular/core";
import { Subscription } from "rxjs";
import { MenubarService } from "./menubar.service";
import { MenuItem } from "./model";
import {
  ResolvedMenuItem,
  resolveMenuItem,
  resolveMenuItems,
} from "./resolvers";

@Component({
  selector: "p-menubarSub",
  templateUrl: "./menubar-sub.component.html",
  styleUrls: ["./menubar.css"],
  encapsulation: ViewEncapsulation.None,
  host: { class: "p-element" },
})
export class MenubarSubComponent implements OnInit, OnDestroy {
  @Input()
  isButtonVisible: boolean;

  @Input() item: MenuItem | any;
  get resolvedItem(): ResolvedMenuItem | ResolvedMenuItem[] {
    if (Array.isArray(this.item)) {
      return resolveMenuItems(this.item);
    }
    return resolveMenuItem(this.item);
  }

  @Input() root = false;

  @Input() autoZIndex = true;

  @Input() baseZIndex = 0;

  @Input() mobileActive = false;

  @Input() autoDisplay = true;

  @Input() get parentActive(): boolean {
    return this._parentActive;
  }
  set parentActive(value) {
    if (!this.root) {
      this._parentActive = value;

      if (!value) this.activeItem = undefined;
    }
  }

  @Output() leafClick: EventEmitter<void> = new EventEmitter();

  _parentActive = false;

  documentClickListener: ((event: Event) => void) | undefined;

  menuHoverActive = false;

  activeItem: MenuItem | undefined;

  mouseLeaveSubscriber: Subscription | undefined;

  constructor(
    public element: ElementRef,
    public renderer: Renderer2,
    private cd: ChangeDetectorRef,
    private menubarService: MenubarService
  ) {
    /** NO OP */
  }

  shouldShowSubmenuIcon(
    child: MenuItem,
    isButtonVisible = false,
    root = false
  ): boolean {
    const hasChildren: boolean =
      child && child.items !== undefined && child.items.length > 0;
    if (!hasChildren) return false;
    const rootAndButtonVisible: boolean = root && isButtonVisible;
    const showSubmenuIcon: boolean = rootAndButtonVisible || !root;
    // console.log(child.label, `vis:${isButtonVisible}`,`root:${root}`, `show:${showSubmenuIcon}`);
    return showSubmenuIcon;
  }

  ngOnInit(): void {
    this.mouseLeaveSubscriber = this.menubarService.mouseLeft$.subscribe(() => {
      this.activeItem = undefined;
      this.cd.markForCheck();
      this.unbindDocumentClickListener();
    });
  }

  onItemClick(event: Event, item: MenuItem): void {
    // console.log('item clicked', item);

    if (item.disabled) {
      event.preventDefault();
      return;
    }

    if (item.command) {
      item.command({
        originalEvent: event,
        item: item,
      });
    }

    if (item.items) {
      if (this.activeItem && item === this.activeItem) {
        this.activeItem = undefined;
        this.unbindDocumentClickListener();
      } else {
        this.activeItem = item;
        if (this.root) {
          this.bindDocumentClickListener();
        }
      }
    }

    if (!item.items) {
      this.onLeafClick();
    }
  }

  onItemMouseLeave(_event: Event, _item: MenuItem): void {
    this.menubarService.mouseLeaves.next(true);
  }

  onItemMouseEnter(event: Event, item: MenuItem): void {
    this.menubarService.mouseLeaves.next(false);

    if (item.disabled || this.mobileActive) {
      event.preventDefault();
      return;
    }

    if (this.root) {
      if (this.activeItem || this.autoDisplay) {
        this.activeItem = item;
        this.bindDocumentClickListener();
      }
    } else {
      this.activeItem = item;
      this.bindDocumentClickListener();
    }
  }

  onLeafClick(): void {
    this.activeItem = undefined;
    if (this.root) {
      this.unbindDocumentClickListener();
    }

    this.leafClick.emit();
  }

  bindDocumentClickListener(): void {
    if (!this.documentClickListener) {
      this.documentClickListener = (event: Event) => {
        if (
          this.element &&
          !this.element.nativeElement.contains(event.target)
        ) {
          this.activeItem = undefined;
          this.cd.markForCheck();
          this.unbindDocumentClickListener();
        }
      };

      document.addEventListener("click", this.documentClickListener);
    }
  }

  unbindDocumentClickListener(): void {
    if (this.documentClickListener) {
      document.removeEventListener("click", this.documentClickListener);
      this.documentClickListener = undefined;
    }
  }

  ngOnDestroy(): void {
    if (this.mouseLeaveSubscriber) {
      this.mouseLeaveSubscriber.unsubscribe();
    }
    this.unbindDocumentClickListener();
  }
}
