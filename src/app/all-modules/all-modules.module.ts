import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AllModulesRoutingModule } from './all-modules-routing.module';
import { AllModulesComponent } from './all-modules.component';
import { HttpClientModule } from '@angular/common/http';
import { Sidebar2Component } from './sidebar2/sidebar2.component';



@NgModule({
  declarations: [
    AllModulesComponent,
    Sidebar2Component,
    
  ],
  imports: [
    CommonModule,
    AllModulesRoutingModule,
    HttpClientModule,

  ]
})
export class AllModulesModule { }
