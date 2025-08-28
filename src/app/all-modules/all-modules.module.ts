import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllModulesRoutingModule } from './all-modules-routing.module';
import { AllModulesComponent } from './all-modules.component';
import { HttpClientModule } from '@angular/common/http';
import { Sidebar2Component } from './sidebar2/sidebar2.component';
import { ItemMenuComponent } from './sidebar2/item-menu.component';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [
    AllModulesComponent,
    Sidebar2Component,
    ItemMenuComponent,
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
