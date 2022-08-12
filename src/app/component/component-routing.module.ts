import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { BlogInnerComponent } from './blog/blog-inner/blog-inner.component';
import { BlogComponent } from './blog/blog.component';
import { BrainWorkoutComponent } from './brain-workout/brain-workout.component';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { CartPageComponent } from './shop/cart-page/cart-page.component';
import { CheckoutInformationComponent } from './shop/checkout-information/checkout-information.component';
import { CheckoutPaymentComponent } from './shop/checkout-payment/checkout-payment.component';
import { CheckoutShippingComponent } from './shop/checkout-shipping/checkout-shipping.component';
import { ShopComponent } from './shop/shop.component';
import { WhatsActComponent } from './whats-act/whats-act.component';
import { EventsComponent } from './events/events.component';
import { ReadMoreComponent } from './read-more/read-more.component';
import { OurTeamComponent } from './our-team/our-team.component';
import { ClinicalStudiesComponent } from './whats-act/clinical-studies/clinical-studies.component';
import { ClinicalStudiesInnerComponent } from './whats-act/clinical-studies-inner/clinical-studies-inner.component';
import { TermsConditionsComponent } from './footer/terms-conditions/terms-conditions.component';
import { PrivacyPolicyComponent } from './footer/privacy-policy/privacy-policy.component';
import { WebsiteDisclaimerComponent } from './footer/website-disclaimer/website-disclaimer.component';
import { CategoryBlogComponent } from './blog/category-blog/category-blog.component';
import { AffiliateComponent } from './affiliate/affiliate.component';
import { SqueezeComponent } from './squeeze/squeeze.component';
import { ClubComponent } from './club/club.component';
import { ShopInnerComponent } from './shop/shop-inner/shop-inner.component';
import { OurProductsComponent } from './our-products/our-products.component';
import { SocialResponsibilityComponent } from './social-responsibility/social-responsibility.component';
import { NeuroClinicalStudiesComponent } from './brain-workout/clinical-studies/clinical-studies.component';
import { NeuroClinicalStudiesInnerComponent } from './brain-workout/clinical-studies-inner/clinical-studies-inner.component';
import { CorporateComponent } from '../common/corporate/corporate.component';
import { WhatsInsideComponent } from '../common/whats-inside/whats-inside.component';
import { FaqComponent } from './faq/faq.component';
import { HomeNewComponent } from './home-new/home-new.component';
const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'shop', component: ShopComponent},
  {path:'about-us', component: AboutComponent},
  {path:'astaxanthin-benefits', component: WhatsActComponent},
  {path:'brain-training-and-cognitive-enhancement-app-neuro-tracker', component: BrainWorkoutComponent},
  {path:'blog', component: BlogComponent},
  {path:'blog/:title', component: BlogInnerComponent},
  {path:'contact-us', component: ContactComponent},
 // {path:'shop/:title', component: ShopInnerComponent},
  {path:'shop/:title/:code/:key', component: ShopInnerComponent},
  {path:'cart-page', component: CartPageComponent},
  {path:'checkout-information', component: CheckoutInformationComponent},
  {path:'checkout-payment', component: CheckoutPaymentComponent},
  {path:'checkout-shipping', component: CheckoutShippingComponent},
  {path:'events', component: EventsComponent},
  {path:'read-more/:title', component: ReadMoreComponent },
  {path:'our-team', component: OurTeamComponent },
  {path:'clinical-studies', component: ClinicalStudiesComponent },
  {path:'clinical-studies/:title', component: ClinicalStudiesInnerComponent},
 // {path:'clinical-studies-inner', component: ClinicalStudiesInnerComponent },
  {path:'privacy-policy', component: PrivacyPolicyComponent },
  {path:'terms-conditions', component: TermsConditionsComponent },
  {path:'website-disclaimer', component: WebsiteDisclaimerComponent },
  {path:'category/:title', component: CategoryBlogComponent},
  {path:'affiliate-programs', component: AffiliateComponent},
  {path:'squeeze', component: SqueezeComponent},
  {path:'club', component: ClubComponent},
  {path:'fight-club', component: ClubComponent},
  {path:'esports-club', component: ClubComponent},
  {path:'motorsports-club', component: ClubComponent},
  {path:'our-products', component: OurProductsComponent},
  {path:'social-responsibility', component: SocialResponsibilityComponent},
  {path:'neurototracker-clinical-studies', component: NeuroClinicalStudiesComponent },
  {path:'neurototracker-clinical-studies/:title', component: NeuroClinicalStudiesInnerComponent},
  {path:'corporate', component: CorporateComponent},
  {path:'whats-inside', component: WhatsInsideComponent},
  {path:'faq', component: FaqComponent},
  {path:'home-new', component: HomeNewComponent},
  /**French Route*/
  // {path:'fr',component:HomeComponent},
  {path:'boutique', component: ShopComponent},
  {path:'a-propos', component: AboutComponent},
  {path:'benefices-astaxanthine', component: WhatsActComponent},
  {path:'application-entrainement-cerebral-amelioration-cognitive-neuro-tracker', component: BrainWorkoutComponent},
  // {path:'blog', component: BlogComponent},
  // {path:'blog/:title', component: BlogInnerComponent},
  {path:'nous-contacter', component: ContactComponent},
 // {path:'boutique/:title', component: ShopInnerComponent},
  {path:'boutique/:title/:code/:key', component: ShopInnerComponent},
  {path:'panier-page', component: CartPageComponent},
  {path:'informations-de-paiement', component: CheckoutInformationComponent},
  {path:'caisse-paiement', component: CheckoutPaymentComponent},
  {path:'caisse-expédition', component: CheckoutShippingComponent},
  {path:'evenements', component: EventsComponent},
  {path:'lire-la-suite/:title', component: ReadMoreComponent },
  {path:'notre-équipe', component: OurTeamComponent },
  {path:'etudes-cliniques', component: ClinicalStudiesComponent },
  {path:'etudes-cliniques/:title', component: ClinicalStudiesInnerComponent},
 // {path:'etudes-cliniques-interne', component: ClinicalStudiesInnerComponent },
  {path:'politique-de-confidentialité', component: PrivacyPolicyComponent },
  {path:'termes-et-conditions', component: TermsConditionsComponent },
  {path:'site-avis-de-non-responsabilité', component: WebsiteDisclaimerComponent },
  {path:'catégorie/:title', component: CategoryBlogComponent},
  {path:'programmes-affilies', component: AffiliateComponent},
  {path:'nos-produits', component: OurProductsComponent},
  {path:'responsabilité-sociale', component: SocialResponsibilityComponent},
  {path:'neurototracker-études-cliniques', component: NeuroClinicalStudiesComponent },
  {path:'neurototracker-études-cliniques/:title', component: NeuroClinicalStudiesInnerComponent},
  {path:'dentreprise', component: CorporateComponent},
  {path:'quest-ce-quil-y-a-à-lintérieur', component: WhatsInsideComponent},
  
  {path:'presser', component: SqueezeComponent},

  {path:'club-de-combat', component: ClubComponent},
  {path:'club-de-lesport', component: ClubComponent},
  {path:'club-de-sport-automobile', component: ClubComponent},

  {path:'faq', component: FaqComponent},



  {path: 'shop/9mm-original-beyond-energy-drink', redirectTo: 'shop',pathMatch: 'full'},
  {path: 'shop/9mm-sugar-free-beyond-energy-drink', redirectTo: 'shop',pathMatch: 'full'},
  {path: 'shop/9mm-neuro-beyond-energy', redirectTo: 'shop',pathMatch: 'full'},

  {path: 'boutique/9mm-original-beyond-energy-drink', redirectTo: 'boutique',pathMatch: 'full'},
  {path: 'boutique/9mm-sugar-free-beyond-energy-drink', redirectTo: 'boutique',pathMatch: 'full'},
  {path: 'boutique/9mm-neuro-beyond-energy', redirectTo: 'boutique',pathMatch: 'full'},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponentRoutingModule { }
