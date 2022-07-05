import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ComponentRoutingModule } from './component-routing.module';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { ShopComponent } from './shop/shop.component';
import { CartPageComponent } from './shop/cart-page/cart-page.component';
import { CheckoutInformationComponent } from './shop/checkout-information/checkout-information.component';
import { CheckoutPaymentComponent } from './shop/checkout-payment/checkout-payment.component';
import { CheckoutShippingComponent } from './shop/checkout-shipping/checkout-shipping.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddToCartComponent } from '../shared/add-to-cart/add-to-cart.component';
import { SharedModule } from '../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { BlogComponent } from './blog/blog.component';
import { WhatsActComponent } from './whats-act/whats-act.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { BrainWorkoutComponent } from './brain-workout/brain-workout.component';
import { BlogInnerComponent } from './blog/blog-inner/blog-inner.component';
import { DisqusModule } from 'ngx-disqus';
import { EventsComponent } from './events/events.component';
import { ReadMoreComponent } from './read-more/read-more.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { OurTeamComponent } from './our-team/our-team.component';
import { ClinicalStudiesComponent } from './whats-act/clinical-studies/clinical-studies.component';
import { ClinicalStudiesInnerComponent } from './whats-act/clinical-studies-inner/clinical-studies-inner.component';
import { TermsConditionsComponent } from './footer/terms-conditions/terms-conditions.component';
import { PrivacyPolicyComponent } from './footer/privacy-policy/privacy-policy.component';
import { WebsiteDisclaimerComponent } from './footer/website-disclaimer/website-disclaimer.component';
import { CategoryBlogComponent } from './blog/category-blog/category-blog.component';
import { AffiliateComponent } from './affiliate/affiliate.component';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SqueezeComponent } from './squeeze/squeeze.component';
import { ClubComponent } from './club/club.component';
import { ShopInnerComponent } from './shop/shop-inner/shop-inner.component';
import { OurProductsComponent } from './our-products/our-products.component';
import { SocialResponsibilityComponent } from './social-responsibility/social-responsibility.component';
import { NeuroClinicalStudiesComponent } from './brain-workout/clinical-studies/clinical-studies.component';
import { NeuroClinicalStudiesInnerComponent } from './brain-workout/clinical-studies-inner/clinical-studies-inner.component';
import { FaqComponent } from './faq/faq.component';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [HeaderComponent, HomeComponent, FooterComponent, ShopComponent,
    CartPageComponent, CheckoutInformationComponent,
    CheckoutPaymentComponent, CheckoutShippingComponent, BlogComponent, WhatsActComponent,
    ContactComponent, AboutComponent, BrainWorkoutComponent, BlogInnerComponent, EventsComponent, ReadMoreComponent, OurTeamComponent, ClinicalStudiesComponent, ClinicalStudiesInnerComponent, TermsConditionsComponent, PrivacyPolicyComponent, WebsiteDisclaimerComponent, CategoryBlogComponent, AffiliateComponent, SqueezeComponent, ClubComponent, ShopInnerComponent, OurProductsComponent, SocialResponsibilityComponent, NeuroClinicalStudiesComponent, NeuroClinicalStudiesInnerComponent, FaqComponent ],
  imports: [
  //  TranslateModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    CommonModule,
    ComponentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgbModule,
    NgxIntlTelInputModule,
    DisqusModule.forRoot('9mm-energy-drink')
  ],
  providers:[DatePipe],
  exports:[HeaderComponent,FooterComponent],
  entryComponents: [AddToCartComponent]
})
export class ComponentModule { }
