import { Input, TemplateRef, Directive } from "@angular/core";

@Directive({
  selector: "[pTemplate]",
  host: {},
})
export class TemplateDirective {
  @Input() type = "";

  @Input("pTemplate") name = "";

  constructor(public template: TemplateRef<any>) {}

  getType(): string {
    return this.name;
  }
}
