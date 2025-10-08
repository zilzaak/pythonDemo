import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseRoutingModule } from './purchase-routing.module';
import { PurchaseComponent } from './purchase.component';
import { PurchCrudComponent } from './purchCrud/purch-crud.component';
import { PurchListComponent } from './purchList/purch-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SupplierListComponent } from './supplier/suppList/supplier-list.component';
import { SuppCrudComponent } from './supplier/suppCrud/supp-crud.component';


@NgModule({
  declarations: [
    PurchaseComponent,
    PurchCrudComponent,
    PurchListComponent,
    SupplierListComponent,
    SuppCrudComponent
  ],
  imports: [
    CommonModule,
    PurchaseRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxPaginationModule
  ]
})
export class PurchaseModule { }
