import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TemplateDirective } from "./template.directive";

@NgModule({
  imports: [CommonModule],
  exports: [TemplateDirective],
  declarations: [TemplateDirective],
})
export class TemplateModule {}
