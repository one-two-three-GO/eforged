import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MenubarComponent } from "./menubar.component";
import { MenubarSubComponent } from "./menubar-sub.component";
import { RippleModule } from "../ripple";
import { TemplateModule } from "../templates";
import { TooltipModule } from "../tooltips";

@NgModule({
  imports: [CommonModule, RippleModule, TooltipModule, TemplateModule],
  exports: [MenubarComponent, TooltipModule, TemplateModule],
  declarations: [MenubarComponent, MenubarSubComponent],
})
export class MenubarModule {}
