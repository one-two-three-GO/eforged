import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { Subscription } from "rxjs";
import { zIndices } from "../../config/z-indices";
import { clearZIndex, isVisible, setZIndex } from "../../dom";
import { TemplateDirective } from "../templates";
import { MenubarSubComponent } from "./menubar-sub.component";
import { MenubarService } from "./menubar.service";
import { MenuItem } from "./model";
import { ResolvedMenuItem, resolveMenuItems } from "./resolvers";

@Component({
  selector: "p-menubar",
  templateUrl: "./menubar.component.html",
  styleUrls: ["./menubar.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: "p-element",
  },
  providers: [MenubarService],
})
export class MenubarComponent
  implements AfterContentInit, AfterViewInit, OnDestroy, OnInit
{
  @Input() model: MenuItem[] | any;
  get resolvedItems(): ResolvedMenuItem[] {
    return resolveMenuItems(this.model);
  }

  @Input() style: { [klass: string]: any };

  @Input() styleClass: string;

  @Input() autoZIndex = true;

  @Input() baseZIndex = 0;

  @Input() autoDisplay = true;

  @Input() autoHide = true;

  @Input() autoHideDelay = 100;

  @ContentChildren(TemplateDirective) templates: QueryList<TemplateDirective>;

  @ViewChild("menubutton") menubutton: ElementRef | undefined;

  @ViewChild("rootmenu") rootmenu: MenubarSubComponent;

  startTemplate: TemplateRef<TemplateDirective>;

  endTemplate: TemplateRef<TemplateDirective>;

  mobileActive = false;

  outsideClickListener:
    | ((this: Document, event: MouseEvent) => void)
    | undefined;

  mouseLeaveSubscriber: Subscription;

  @Input()
  protected isButtonVisible = false;

  constructor(
    public element: ElementRef,
    public renderer: Renderer2,
    public cd: ChangeDetectorRef,
    private menubarService: MenubarService
  ) {}

  ngAfterViewInit(): void {
    this.isButtonVisible = this.getIsButtonVisible();
  }

  onResize(_?: Event): void {
    this.isButtonVisible = this.getIsButtonVisible();
  }

  getIsButtonVisible(): boolean {
    if (!this.menubutton) return false;

    const element: HTMLElement = this.menubutton.nativeElement;
    return isVisible(element);
  }

  ngOnInit(): void {
    this.onResize();
    this.menubarService.autoHide = this.autoHide;
    this.menubarService.autoHideDelay = this.autoHideDelay;
    this.mouseLeaveSubscriber = this.menubarService.mouseLeft$.subscribe(() =>
      this.unbindOutsideClickListener()
    );
  }

  ngAfterContentInit(): void {
    if (!this.templates) return;

    for (const item of this.templates) {
      switch (item.getType()) {
        case "start": {
          this.startTemplate = item.template;
          break;
        }

        case "end": {
          this.endTemplate = item.template;
          break;
        }
      }
    }
  }

  toggle(event: Event): void {
    if (!this.rootmenu) return;

    if (this.mobileActive) {
      this.hide();
      clearZIndex(this.rootmenu.element.nativeElement);
    } else {
      this.mobileActive = true;
      setZIndex("menu", this.rootmenu.element.nativeElement, zIndices.menu);
    }

    this.bindOutsideClickListener();
    event.preventDefault();
  }

  bindOutsideClickListener(): void {
    if (!this.outsideClickListener) {
      this.outsideClickListener = (event: Event) => {
        if (!this.rootmenu) return;
        if (!this.menubutton) return;

        if (
          this.mobileActive &&
          this.rootmenu.element.nativeElement !== event.target &&
          !this.rootmenu.element.nativeElement.contains(event.target) &&
          this.menubutton.nativeElement !== event.target &&
          !this.menubutton.nativeElement.contains(event.target)
        ) {
          this.hide();
        }
      };
      document.addEventListener("click", this.outsideClickListener);
    }
  }

  hide(): void {
    if (!this.rootmenu) return;

    this.mobileActive = false;
    this.cd.markForCheck();
    clearZIndex(this.rootmenu.element.nativeElement);
    this.unbindOutsideClickListener();
  }

  onLeafClick(): void {
    this.hide();
  }

  unbindOutsideClickListener(): void {
    if (this.outsideClickListener) {
      document.removeEventListener("click", this.outsideClickListener);
      this.outsideClickListener = undefined;
    }
  }

  ngOnDestroy(): void {
    if (this.mouseLeaveSubscriber) {
      this.mouseLeaveSubscriber.unsubscribe();
    }
    this.unbindOutsideClickListener();
  }
}
