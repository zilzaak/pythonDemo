import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesInvoiceComponent } from './salesInvoice/sales-invoice.component';
import { SalesCreateComponent } from './salesCreate/sales-create.component';
import { SalesEditComponent } from './salesEdit/sales-edit.component';
import { CustomerEditComponent } from './customerEdit/customer-edit.component';
import { CustomerCreateComponent } from './customerCreate/customer-create.component';
import { CustomerListComponent } from './customerList/customer-list.component';

const routes: Routes = [

    { path: 'list',component: SalesInvoiceComponent,
      data: { title: 'Invoice List'},
    },
      {
        path: 'create', component: SalesCreateComponent,
        data: { title: 'Create' },
      },
      {
        path: 'edit/:id', component: SalesEditComponent,
        data: { title: 'Edit' },
      },
      {
        path: 'view/:id', component: SalesEditComponent,
        data: { title: 'View' },
      },
      {
        path: 'customer/create', component: CustomerCreateComponent,
        data: { title: 'Create' },
      },
      {
        path: 'customer/edit/:id', component: CustomerEditComponent,
        data: { title: 'Edit' },
      },
      {
        path: 'customer/view/:id', component: CustomerEditComponent,
        data: { title: 'View' },
      },
      {
        path: 'customer/list', component: CustomerListComponent,
        data: { title: 'List' },
      },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
