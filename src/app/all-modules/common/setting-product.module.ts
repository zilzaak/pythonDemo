import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingProductRoutingModule } from './setting-product-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SettingProductComponent } from './setting-product.component';
import { ProductCritComponent } from './productCriteria/list/product-crit.component';
import { ProductCritCreateComponent } from './productCriteria/create/product-crit-create.component';

@NgModule({
  declarations: [
    SettingProductComponent,
    ProductCritComponent,
    ProductCritCreateComponent,

  ],
  imports: [
        CommonModule,
        SettingProductRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule ,
        NgxPaginationModule
  ]
})
export class SettingProductModule { }
