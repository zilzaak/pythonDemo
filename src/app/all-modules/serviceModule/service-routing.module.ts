import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceCreateComponent } from './create/service-create.component';
import { ServiceEditComponent } from './edit/service-edit.component';
import { ServiceListComponent } from './list/service-list.component';

const routes: Routes = [

  {
    path:"create" ,
    component: ServiceCreateComponent ,
    data: { title: 'Service Create' },
  },
  {
    path:"edit/:id" ,
    component: ServiceEditComponent,
    data: { title: 'Service edit' },
  },
  {
    path:"list" ,
    component: ServiceListComponent,
    data: { title: 'Service List' },
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceRoutingModule { }
