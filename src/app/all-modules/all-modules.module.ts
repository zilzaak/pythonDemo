import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllModulesRoutingModule } from './all-modules-routing.module';
import { AllModulesComponent } from './all-modules.component';
import { HttpClientModule } from '@angular/common/http';
import { Sidebar2Component } from './sidebar2/sidebar2.component';
import { ItemMenuComponent } from './sidebar2/item-menu.component';
import { OrgCreateComponent } from './common/organization/create/org-create.component';
import { OrgEditComponent } from './common/organization/edit/org-edit.component';
import { OrgListComponent } from './common/organization/list/org-list.component';
import { ProductCreateComponent } from './common/product/create/product-create.component';
import { ProductListComponent } from './common/product/list/product-list.component';
import { ProducteditComponent } from './common/product/edit/productedit.component';
import { ProductCritCreateComponent } from './common/productCriteria/create/product-crit-create.component';
import { ProductCritEditComponent } from './common/productCriteria/edit/product-crit-edit.component';
import { ProductCritComponent } from './common/productCriteria/list/product-crit.component';

@NgModule({
  declarations: [
    AllModulesComponent,
    Sidebar2Component,
    ItemMenuComponent,
    OrgCreateComponent,
    OrgEditComponent,
    OrgListComponent,
    ProductCreateComponent,
    ProductListComponent,
    ProducteditComponent,
    ProductCritCreateComponent,
    ProductCritEditComponent,
    ProductCritComponent,
  
  ],
  imports: [
    CommonModule,
    AllModulesRoutingModule,
    HttpClientModule,

  ]
})
export class AllModulesModule {


  

 }
