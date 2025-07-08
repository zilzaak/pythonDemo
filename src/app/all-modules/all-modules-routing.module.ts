import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllModulesComponent } from './all-modules.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: AllModulesComponent,
    children: [
     {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },

      {
        path: 'school',
        loadChildren: () => import('./schoolModule/school.module').then(m => m.SchoolModule)
      },

      {
        path: 'service',
        loadChildren: () => import('./serviceModule/service.module').then(m => m.ServiceModule)
      },

      {
        path: 'setting',
        loadChildren: () => import('./settingModule/setting.module').then(m => m.SettingModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllModulesRoutingModule { }
