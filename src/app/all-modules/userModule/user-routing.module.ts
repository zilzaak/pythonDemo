import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { UserListComponent } from './list/user-list.component';
import { UserCreateComponent } from './create/user-create.component';
import { UserCreateEditComponent } from './edit/user-create-edit.component';
import { RoleListComponent } from './roleList/role-list.component';
import { CreateRoleComponent } from './createRole/create-role.component';
import { EditRoleComponent } from './editRole/edit-role.component';

const routes: Routes = [
  {
    path: 'list', component: UserListComponent,
    data: { title: 'User List' },
  },

  {
    path: 'create', component: UserCreateComponent,
    data: { title: 'Create User' },
  },

  {
    path: 'edit/:id', component: UserCreateEditComponent,
    data: { title: 'Edit User' },
  },

  {
    path: 'role/list', component: RoleListComponent,
    data: { title: 'Role List' },
  },

  {
    path: 'role/create', component: CreateRoleComponent,
    data: { title: 'Create Role' },
  },

  {
    path: 'role/edit/:id', component: EditRoleComponent,
    data: { title: 'Edit Role' },
  },
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
