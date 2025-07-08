import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseRoutingModule } from './base-routing.module';
import { BaseComponent } from './base.component';
import { MenuListComponent } from './menu/list/menu-list/menu-list.component';


@NgModule({
  declarations: [
    BaseComponent,
    MenuListComponent
  ],
  imports: [
    CommonModule,
    BaseRoutingModule
  ]
})
export class BaseModule { 

  
}
