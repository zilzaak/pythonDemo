import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseRoutingModule } from './base-routing.module';
import { BaseComponent } from './base.component';
import { MenuListComponent } from './menu/list/menu-list.component';
import { UserListComponent } from './user/list/user-list.component';
import { MenuCreateComponent } from './menu/create/menu-create.component';
import { UserCreateComponent } from './user/create/user-create.component';
import { RoleCreateComponent } from './role/create/role-create.component';
import { RoleListComponent } from './role/list/role-list.component';
import { PermissionListComponent } from './menuPerm/list/permission-list.component';
import { PermissionCreateComponent } from './menuPerm/create/permission-create.component';
import { PermissionEditComponent } from './menuPerm/edit/permission-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrganizationComponent } from './org/list/organization.component';
import { OrgCreateComponent } from './org/create/org-create.component';



@NgModule({
  declarations: [
    BaseComponent,
    MenuListComponent,MenuCreateComponent,
    UserCreateComponent,UserListComponent,
    RoleCreateComponent,RoleListComponent, 
    PermissionListComponent, PermissionCreateComponent,
     PermissionEditComponent,
     OrganizationComponent,
     OrgCreateComponent,
  ],
  imports: [
    CommonModule,
    BaseRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class BaseModule { 

  
}
