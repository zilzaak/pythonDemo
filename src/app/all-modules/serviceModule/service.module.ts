import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceRoutingModule } from './service-routing.module';
import { ServiceComponent } from './service.component';
import { ServiceListComponent } from './list/service-list.component';
import { ServiceEditComponent } from './edit/service-edit.component';
import { ServiceCreateComponent } from './create/service-create.component';


@NgModule({
  declarations: [
    ServiceComponent,
    ServiceListComponent,
    ServiceEditComponent,
    ServiceCreateComponent
  ],
  imports: [
    CommonModule,
    ServiceRoutingModule
  ]
})
export class ServiceModule { }
