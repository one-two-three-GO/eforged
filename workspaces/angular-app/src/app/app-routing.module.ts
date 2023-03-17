import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DemoComponent } from "./components/local-prime/ef-demo/demo.component";

const routes: Routes = [
  {
    /** The "Main" page, which is drawn over top of the app.component.html */
    path: "",
    component: DemoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
