import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'login', loadChildren: () => import(`./login-module/login-module.module`).then(m => m.LoginModuleModule) },
  { path: '', loadChildren: () => import(`./all-modules/all-modules.module`).then(m => m.AllModulesModule)},
  { path: '**', loadChildren: () => import(`./login-module/login-module.module`).then(m => m.LoginModuleModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
