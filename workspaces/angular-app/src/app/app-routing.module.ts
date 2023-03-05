import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MultiplesComponent } from './components/multiples/multiples.component';

const routes: Routes = [
	{
		/** The "Main" page, which is drawn over top of the app.component.html */
		path: '',
		component: MultiplesComponent,
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
