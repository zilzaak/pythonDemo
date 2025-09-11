import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchListComponent } from './purchList/purch-list.component';
import { PurchCrudComponent } from './purchCrud/purch-crud.component';

const routes: Routes = [
     { path: 'list',component: PurchListComponent,
      data: { title: 'Purchase List'},
    },
      {
        path: 'create', component: PurchCrudComponent,
        data: { title: 'Create' },
      },
      {
        path: 'edit/:id', component: PurchCrudComponent,
        data: { title: 'Edit' },
      },
      {
        path: 'view/:id', component: PurchCrudComponent,
        data: { title: 'View' },
      }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRoutingModule { }
