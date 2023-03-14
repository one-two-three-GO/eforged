import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { MenubarModule } from "../menus/menubar.module";
import { DemoComponent } from "./demo.component";

@NgModule({
  declarations: [DemoComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MenubarModule,
    InputTextModule,
    ButtonModule,
  ],
  providers: [],
})
export class DemoModule {}
