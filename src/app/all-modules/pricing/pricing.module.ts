import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PricingRoutingModule } from './pricing-routing.module';
import { PricingComponent } from './pricing.component';
import { PricingCreateComponent } from './details/create/pricing-create.component';
import { CpriceeditComponent } from './details/edit/cpriceedit.component';
import { CpricelistComponent } from './details/list/cpricelist.component';


@NgModule({
  declarations: [
    PricingComponent,
    PricingCreateComponent,
    CpriceeditComponent,
    CpricelistComponent
  ],
  imports: [
    CommonModule,
    PricingRoutingModule
  ]
})
export class PricingModule { }
