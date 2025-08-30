import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductCritComponent } from './productCriteria/list/product-crit.component';
import { ProductCritCreateComponent } from './productCriteria/create/product-crit-create.component';


const routes: Routes = [ {
    path: 'productCrit/create',component: ProductCritCreateComponent,
    data: { title: 'Create' },
  },
    {
      path: 'productCrit/list', component: ProductCritComponent,
      data: { title: 'List' },
    },
    {
      path: 'productCrit/edit/:entity/:id', component: ProductCritCreateComponent,
      data: { title: 'Edit' },
    },
    {
      path: 'productCrit/view/:entity/:id', component: ProductCritCreateComponent,
      data: { title: 'View' },
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingProductRoutingModule { }
