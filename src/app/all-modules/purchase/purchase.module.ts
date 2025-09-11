import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseRoutingModule } from './purchase-routing.module';
import { PurchaseComponent } from './purchase.component';
import { PurchCrudComponent } from './purchCrud/purch-crud.component';
import { PurchListComponent } from './purchList/purch-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    PurchaseComponent,
    PurchCrudComponent,
    PurchListComponent
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
