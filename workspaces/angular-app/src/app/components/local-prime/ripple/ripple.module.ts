import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RippleDirective } from "./ripple.directive";

@NgModule({
  imports: [CommonModule],
  exports: [RippleDirective],
  declarations: [RippleDirective],
})
export class RippleModule {}
