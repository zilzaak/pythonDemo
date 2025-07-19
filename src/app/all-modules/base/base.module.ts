import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BaseRoutingModule } from './base-routing.module';
import { BaseComponent } from './base.component';
import { MenuListComponent } from './menu/list/menu-list.component';
import { MenuEditComponent } from './menu/edit/menu-edit.component';
import { UserEditComponent } from './user/edit/user-edit.component';
import { UserListComponent } from './user/list/user-list.component';
import { MenuCreateComponent } from './menu/create/menu-create.component';
import { UserCreateComponent } from './user/create/user-create.component';
import { RoleCreateComponent } from './role/create/role-create.component';
import { RoleEditComponent } from './role/edit/role-edit.component';
import { RoleListComponent } from './role/list/role-list.component';
import { PermissionListComponent } from './menuPerm/list/permission-list.component';
import { PermissionCreateComponent } from './menuPerm/create/permission-create.component';
import { PermissionEditComponent } from './menuPerm/edit/permission-edit.component';



@NgModule({
  declarations: [
    BaseComponent,
    MenuListComponent,MenuCreateComponent,MenuEditComponent,
    UserCreateComponent,UserEditComponent,UserListComponent,
    RoleCreateComponent,RoleEditComponent,RoleListComponent, 
    PermissionListComponent, PermissionCreateComponent,
     PermissionEditComponent,
  ],
  imports: [
    CommonModule,
    BaseRoutingModule
  ]
})
export class BaseModule { 

  
}
