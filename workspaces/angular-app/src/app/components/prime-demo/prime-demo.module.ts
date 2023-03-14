import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { MenubarModule } from "primeng/menubar";
import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { PrimeDemoComponent } from "./prime-demo.component";

@NgModule({
  declarations: [PrimeDemoComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MenubarModule,
    InputTextModule,
    ButtonModule,
  ],
  providers: [],
})
export class PrimeDemoModule {}
