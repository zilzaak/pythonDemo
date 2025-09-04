import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuListComponent } from './menu/list/menu-list.component';
import { MenuCreateComponent } from './menu/create/menu-create.component';
import { UserListComponent } from './user/list/user-list.component';
import { UserCreateComponent } from './user/create/user-create.component';
import { RoleListComponent } from './role/list/role-list.component';
import { RoleCreateComponent } from './role/create/role-create.component';
import { PermissionListComponent } from './menuPerm/list/permission-list.component';
import { PermissionCreateComponent } from './menuPerm/create/permission-create.component';
import { OrgCreateComponent } from './org/create/org-create.component';
import { OrganizationComponent } from './org/list/organization.component';

const routes: Routes = [

  //all menu in this project 
 {
    path: 'menu/list', component: MenuListComponent,
    data: { title: 'List' },
  },

  {
    path: 'menu/create', component: MenuCreateComponent,
    data: { title: 'Create' },
  },

  {
    path: 'menu/edit/:id', component: MenuCreateComponent,
    data: { title: 'Edit' },
  },
  {
    path: 'menu/view/:id', component: MenuCreateComponent,
    data: { title: 'View' },
  },

// menu permnission 
 {
    path: 'menuPerm/list', component: PermissionListComponent,
    data: { title: 'Menu Permission' },
  },

  {
    path: 'menuPerm/create', component: PermissionCreateComponent,
    data: { title: 'Create' },
  },

  {
    path: 'menuPerm/edit/:id', component: PermissionCreateComponent,
    data: { title: 'Edit' },
  },
  {
    path: 'menuPerm/view/:id', component: PermissionCreateComponent,
    data: { title: 'View' },
  },


  //user data

  {
    path: 'user/list', component: UserListComponent,
    data: { title: 'Menu List' },
  },

  {
    path: 'user/create', component: UserCreateComponent,
    data: { title: 'Create' },
  },

  {
    path: 'user/edit/:id', component: UserCreateComponent,
    data: { title: 'Edit' },
  },
  {
    path: 'user/view/:id', component: UserCreateComponent,
    data: { title: 'View' },
  },

  {
    path: 'role/list', component: RoleListComponent,
    data: { title: 'Role List' },
  },

  {
    path: 'role/create', component: RoleCreateComponent,
    data: { title: 'Role Create' },
  },
  {
    path: 'role/view/:id', component: RoleCreateComponent,
    data: { title: 'Role View' },
  },

  {
    path: 'role/edit/:id', component: RoleCreateComponent,
    data: { title: 'Role Edit' },
  },
  {
    path: 'organization/create', component: OrgCreateComponent,
    data: { title: 'Create',entity:'Organization' },
  },
  {
    path: 'organization/view/:id', component: OrgCreateComponent,
    data: { title: 'View',entity:'Organization' },
  },

  {
    path: 'organization/edit/:id', component: OrgCreateComponent,
    data: { title: 'Edit' ,entity:'Organization'},
  },
  {
    path: 'organization/list', component: OrganizationComponent,
    data: { title: 'List' ,entity:'Organization'},
  },
  {
    path: 'branch/create', component: OrgCreateComponent,
    data: { title: 'Create' , entity:'Branch'},
  },
  {
    path: 'branch/view/:id', component: OrgCreateComponent,
    data: { title: 'View' , entity:'Branch'},
  },

  {
    path: 'branch/edit/:id', component: OrgCreateComponent,
    data: { title: 'Edit' , entity:'Branch'},
  },
  {
    path: 'branch/list', component: OrganizationComponent,
    data: { title: 'List' , entity:'Branch' },
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule { 


  
}
