import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DemoComponent } from "./components/ef-demo/demo.component";
// import { PrimeDemoComponent } from './components/prime-demo/prime-demo.component';

const routes: Routes = [
  // {
  // 	/** The "Main" page, which is drawn over top of the app.component.html */
  // 	path: '',
  // 	component: PrimeDemoComponent,
  // },
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
