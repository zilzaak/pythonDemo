import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseRoutingModule } from './purchase-routing.module';
import { PurchaseComponent } from './purchase.component';
import { PurchCrudComponent } from './purchCrud/purch-crud.component';
import { PurchListComponent } from './purchList/purch-list.component';


@NgModule({
  declarations: [
    PurchaseComponent,
    PurchCrudComponent,
    PurchListComponent
  ],
  imports: [
    CommonModule,
    PurchaseRoutingModule
  ]
})
export class PurchaseModule { }
