import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { SalesComponent } from './sales.component';
import { SalesCreateComponent } from './salesCreate/sales-create.component';
import { SalesEditComponent } from './salesEdit/sales-edit.component';
import { SalesInvoiceComponent } from './salesInvoice/sales-invoice.component';
import { CustomerListComponent } from './customerList/customer-list.component';
import { CustomerCreateComponent } from './customerCreate/customer-create.component';
import { CustomerEditComponent } from './customerEdit/customer-edit.component';


@NgModule({
  declarations: [
    SalesComponent,
    SalesCreateComponent,
    SalesEditComponent,
    SalesInvoiceComponent,
    CustomerListComponent,
    CustomerCreateComponent,
    CustomerEditComponent
  ],
  imports: [
    CommonModule,
    SalesRoutingModule
  ]
})
export class SalesModule { }
