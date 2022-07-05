import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path:'com', loadChildren: './component/component.module#ComponentModule' },
  {path:'auth', loadChildren: './authentication/authentication.module#AuthenticationModule' },
  {
    path: 'en',
    children: [
      {path:'', loadChildren: './component/component.module#ComponentModule' },
      {path:'', loadChildren: './authentication/authentication.module#AuthenticationModule' },
    ]
  },
  {
    path: 'fr',
    children: [
      {path:'', loadChildren: './component/component.module#ComponentModule' },
      {path:'', loadChildren: './authentication/authentication.module#AuthenticationModule' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
