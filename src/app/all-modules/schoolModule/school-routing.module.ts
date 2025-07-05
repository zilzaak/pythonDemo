import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './create/product-list.component';
import { ProductCreateComponent } from './list/product-create.component';
import { ProductEditComponent } from './edit/product-edit.component';

const routes: Routes = [  {
    path: 'list', component: ProductListComponent,
    data: { title: 'User List' },
  },

  {
    path: 'create', component: ProductCreateComponent,
    data: { title: 'Create User' },
  },

  {
    path: 'edit/:id', component: ProductEditComponent,
    data: { title: 'Edit User' },
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchoolRoutingModule { }
