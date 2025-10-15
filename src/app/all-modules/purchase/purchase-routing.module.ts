import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PurchListComponent } from './purchList/purch-list.component';
import { PurchCrudComponent } from './purchCrud/purch-crud.component';
import { SupplierListComponent } from './supplier/suppList/supplier-list.component';
import { SuppCrudComponent } from './supplier/suppCrud/supp-crud.component';

const routes: Routes = [
     { path: 'product/list',component: PurchListComponent,
      data: { title: 'Purchase List'},
    },
      {
        path: 'product/create', component: PurchCrudComponent,
        data: { title: 'Create' },
      },
      {
        path: 'product/edit/:id', component: PurchCrudComponent,
        data: { title: 'Edit' },
      },
      {
        path: 'product/view/:id', component: PurchCrudComponent,
        data: { title: 'View' },
      },
      {
        path: 'supplier/list', component: SupplierListComponent,
        data: { title: 'List' }
      },
      {
        path: 'supplier/edit/:id', component: SuppCrudComponent,
        data: { title: 'Edit' }
      },
      {
        path: 'supplier/view/:id', component: SuppCrudComponent,
        data: { title: 'View' }
      },
      {
        path: 'supplier/create', component: SuppCrudComponent,
        data: { title: 'Create' }
      },

    ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseRoutingModule { }
