import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllModulesRoutingModule } from './all-modules-routing.module';
import { AllModulesComponent } from './all-modules.component';
import { HttpClientModule } from '@angular/common/http';
import { Sidebar2Component } from './sidebar2/sidebar2.component';
import { ItemMenuComponent } from './sidebar2/item-menu.component';
import { ProductCreateComponent } from './common/product/create/product-create.component';
import { ProductListComponent } from './common/product/list/product-list.component';
import { ProducteditComponent } from './common/product/edit/productedit.component';
import { ProductCritCreateComponent } from './common/productCriteria/create/product-crit-create.component';
import { ProductCritComponent } from './common/productCriteria/list/product-crit.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    AllModulesComponent,
    Sidebar2Component,
    ItemMenuComponent,
    ProductCreateComponent,
    ProductListComponent,
    ProducteditComponent,
    ProductCritCreateComponent,
    ProductCritComponent,
  
  ],
  imports: [
    CommonModule,
    AllModulesRoutingModule,
    HttpClientModule,
    NgxPaginationModule
  ]
})
export class AllModulesModule {


  

 }
