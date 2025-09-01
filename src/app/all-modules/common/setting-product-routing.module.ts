import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductCritComponent } from './productCriteria/list/product-crit.component';
import { ProductCritCreateComponent } from './productCriteria/create/product-crit-create.component';
import { ProductListComponent } from './product/list/product-list.component';
import { ProductCreateComponent } from './product/create/product-create.component';


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
      path: 'product/view/:id', component: ProductCreateComponent,
      data: { title: 'View' },
    },
    {
    path: 'product/create',component: ProductCreateComponent,
    data: { title: 'Create' },
    },
    {
      path: 'product/edit/:id', component: ProductCreateComponent,
      data: { title: 'Edit' },
    },
    {
      path: 'product/list', component: ProductListComponent,
      data: { title: 'List' },
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingProductRoutingModule { }
