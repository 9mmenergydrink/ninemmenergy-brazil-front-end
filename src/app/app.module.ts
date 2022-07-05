import { BrowserModule, Meta } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentModule } from './component/component.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ApiService } from './services/api.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationModule } from './authentication/authentication.module';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DisqusModule } from 'ngx-disqus';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CorporateComponent } from './common/corporate/corporate.component';
import { WhatsInsideComponent } from './common/whats-inside/whats-inside.component';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    CorporateComponent,
    WhatsInsideComponent
  ],
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserModule,
    AppRoutingModule,
    ComponentModule,
    HttpClientModule,
    NgbModule,
    AuthenticationModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    DisqusModule.forRoot('9mm-energy-drink')
  ],
  providers: [ApiService, Meta],
  bootstrap: [AppComponent]
})
export class AppModule { }
