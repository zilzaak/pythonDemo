import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchoolRoutingModule } from './school-routing.module';
import { SchoolComponent } from './school.component';
import { ProductListComponent } from './create/product-list.component';
import { ProductEditComponent } from './edit/product-edit.component';
import { ProductCreateComponent } from './list/product-create.component';


@NgModule({
  declarations: [
    SchoolComponent,
    ProductListComponent,
    ProductEditComponent,
    ProductCreateComponent
  ],
  imports: [
    CommonModule,
    SchoolRoutingModule
  ]
})
export class SchoolModule { }
