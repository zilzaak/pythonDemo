import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin/admin-dashboard.component';
import { DashboardComponent } from './dashboard.component';


const routes: Routes = [{
  path: '',
  redirectTo: 'admin',
  pathMatch: 'full'
},
{
  path: "",
  component: DashboardComponent,
  children: [
    { path: "admin", component: AdminDashboardComponent, data: { title: 'Admin Dashboard' } },
  ],
},
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
