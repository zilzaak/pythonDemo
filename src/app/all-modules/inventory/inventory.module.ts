import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryComponent } from './inventory.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { InvCrudComponent } from './inventCrud/inv-crud.component';
import { InvListComponent } from './inventList/inv-list.component';


@NgModule({
  declarations: [
    InventoryComponent,
    InvCrudComponent,
    InvListComponent
  ],
  imports: [
    CommonModule,
    InventoryRoutingModule,
            FormsModule,
            ReactiveFormsModule,
            NgSelectModule ,
            NgxPaginationModule
  ]
})
export class InventoryModule { }
