import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuListComponent } from './menu/list/menu-list.component';
import { MenuCreateComponent } from './menu/create/menu-create.component';
import { MenuEditComponent } from './menu/edit/menu-edit.component';
import { UserListComponent } from './user/list/user-list.component';
import { UserCreateComponent } from './user/create/user-create.component';
import { UserEditComponent } from './user/edit/user-edit.component';
import { RoleListComponent } from './role/list/role-list.component';
import { RoleCreateComponent } from './role/create/role-create.component';
import { RoleEditComponent } from './role/edit/role-edit.component';

const routes: Routes = [

  //all menu in this project 
 {
    path: '/menu/list', component: MenuListComponent,
    data: { title: 'Menu List' },
  },

  {
    path: '/menu/create', component: MenuCreateComponent,
    data: { title: 'Create Menu' },
  },

  {
    path: '/menu/edit/:id', component: MenuEditComponent,
    data: { title: 'Edit Menu' },
  },

// menu permnission 
 {
    path: '/menuPerm/list', component: MenuListComponent,
    data: { title: 'Menu Permission' },
  },

  {
    path: '/menuPerm/create', component: MenuCreateComponent,
    data: { title: 'Permission List' },
  },

  {
    path: '/menuPerm/edit/:id', component: MenuEditComponent,
    data: { title: 'Edit Persion' },
  },


  //user data

  {
    path: '/user/list', component: UserListComponent,
    data: { title: 'Menu List' },
  },

  {
    path: '/user/create', component: UserCreateComponent,
    data: { title: 'Create Menu' },
  },

  {
    path: '/user/edit/:id', component: UserEditComponent,
    data: { title: 'Edit Menu' },
  },

  {
    path: '/role/list', component: RoleListComponent,
    data: { title: 'Role List' },
  },

  {
    path: '/role/create', component: RoleCreateComponent,
    data: { title: 'Role Create' },
  },

  {
    path: '/role/edit/:id', component: RoleEditComponent,
    data: { title: 'Role Edit' },
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule { 


  
}
