import { PaymentMethodComponent } from './../account/payment-method/payment-method.component';
import { ProfilePwdComponent } from './../account/profile-pwd/profile-pwd.component';
import { DeliveryAddressComponent } from './../account/delivery-address/delivery-address.component';
import { CommunicationPrivacyComponent } from './../account/communication-privacy/communication-privacy.component';
import { OrdersComponent } from './../account/orders/orders.component';
import { AccountComponent } from './../account/account.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './login/login.component';
import { ComponentModule } from '../component/component.module';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForgotPwdComponent } from './forgot-pwd/forgot-pwd.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { OrderFilterPipe } from '../shared/pipes/order-filter.pipe';
import { SharedModule } from '../shared/shared.module';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    ForgotPwdComponent,
    AccountComponent,
    OrdersComponent,
    CommunicationPrivacyComponent,
    DeliveryAddressComponent,
    ProfilePwdComponent,
    PaymentMethodComponent,
    OrderFilterPipe
  ],
  imports: [
    NgbModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthenticationRoutingModule,
    ComponentModule,
    SharedModule,
    NgxIntlTelInputModule,
   // TranslateModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  exports:[
    OrdersComponent,
    DeliveryAddressComponent,
    ProfilePwdComponent
  ]
})
export class AuthenticationModule { }
