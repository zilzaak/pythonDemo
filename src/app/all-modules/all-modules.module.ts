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
  
  ],
  imports: [
    CommonModule,
    AllModulesRoutingModule,
    HttpClientModule,

  ]
})
export class AllModulesModule {


  

 }
