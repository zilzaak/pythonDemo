import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PricingCreateComponent } from './details/create/pricing-create.component';
import { CpricelistComponent } from './details/list/cpricelist.component';
import { CpriceeditComponent } from './details/edit/cpriceedit.component';

const routes: Routes = [
 {
    path: 'list', component: PricingCreateComponent,
    data: { title: 'Menu List' },
  },

  {
    path: 'create', component: CpriceeditComponent,
    data: { title: 'Create Menu' },
  },

  {
    path: 'edit/:id', component: CpricelistComponent,
    data: { title: 'Edit Menu' },
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PricingRoutingModule { }
