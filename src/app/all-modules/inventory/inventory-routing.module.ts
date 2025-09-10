import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvListComponent } from './inventList/inv-list.component';
import { InvCrudComponent } from './inventCrud/inv-crud.component';

const routes: Routes = [
     { path: 'list',component: InvListComponent,
      data: { title: 'Inventory List'},
    },
      {
        path: 'create', component: InvCrudComponent,
        data: { title: 'Create' },
      },
      {
        path: 'edit/:id', component: InvCrudComponent,
        data: { title: 'Edit' },
      },
      {
        path: 'view/:id', component: InvCrudComponent,
        data: { title: 'View' },
      }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
