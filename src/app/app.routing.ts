import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import {LoginComponent} from './user/login/login.component';
import {RegisterComponent} from './user/register/register.component';
import {ActivateComponent} from './user/activate/activate.component';
import {ResetPasswordInitComponent} from './user/reset-password/reset-password-init/reset-password-init.component';
import {ResetPasswordFinishComponent} from './user/reset-password/reset-password-finish/reset-password-finish.component';
import {UnauthorizedComponent} from './user/unauthorized/unauthorized.component';
import {AuthGuard} from './_service/guard';
import {HomeComponent} from './home/home.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: AdminLayoutComponent,
  //   canActivate: [AuthGuard]
  // },
  // { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'signup', component: RegisterComponent},
  { path: 'activate', component: ActivateComponent },
  { path: 'reset-password', redirectTo: 'reset-password/init', pathMatch: 'full' },
  { path: 'reset-password/init', component: ResetPasswordInitComponent },
  { path: 'reset-password/finish', component: ResetPasswordFinishComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
        {
          path: '',
          loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
        }
      ]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
       useHash: true
    })
  ],
  exports: [
  ],
})

export class AppRoutingModule { }
