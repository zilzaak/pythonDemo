import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { UserListComponent } from './list/user-list.component';
import { UserCreateComponent } from './create/user-create.component';
import { UserCreateEditComponent } from './edit/user-create-edit.component';
import { RoleListComponent } from './roleList/role-list.component';
import { CreateRoleComponent } from './createRole/create-role.component';
import { EditRoleComponent } from './editRole/edit-role.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    UserComponent,
    UserListComponent,
    UserCreateComponent,
    UserCreateEditComponent,
    RoleListComponent,
    CreateRoleComponent,
    EditRoleComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
     NgxPaginationModule ,
     ReactiveFormsModule 
     
  ]
})
export class UserModule { }
