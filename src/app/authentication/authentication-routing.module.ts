import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from '../account/account.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { AuthGuard } from '../services/auth.guard';
import { ForgotPwdComponent } from './forgot-pwd/forgot-pwd.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {path:'login', component: LoginComponent},
  {path:'register', component: RegisterComponent},
  {path:'forgot-password', component: ForgotPwdComponent},
  {path:'account', component: AccountComponent, canActivate: [AuthGuard]},

  /**French Route*/
  {path:'connexion', component: LoginComponent},
  {path: "s'inscrire", component: RegisterComponent},
  {path:'mot-de-passe-oublié', component: ForgotPwdComponent},
  {path:'compte', component: AccountComponent, canActivate: [AuthGuard]},
  //Wild Card Route for 404 request
  { path: '**', pathMatch: 'full', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
