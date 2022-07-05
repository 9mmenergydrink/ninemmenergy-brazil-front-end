import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonMethods } from 'src/app/common/common-methods';
import { ApiService } from 'src/app/services/api.service';
import Prismic from 'prismic-javascript';
import { prismicEnConstants } from 'src/app/common/prismic-Enconstants';
import { prismicFrConstants } from 'src/app/common/prismic-Frconstants';
import {TranslateService} from '@ngx-translate/core';
import { CommonMethodsService } from 'src/app/shared/common-methods/common-methods.service';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.css']
})
export class CheckoutPaymentComponent implements OnInit {
  pageTitle = "";
  cartDetails = [];
  cartCount: any;
  shipping = 20.00;
  total;
  contact;
  address;
  common;
  language: any;
  constant: any;
  langkey: any;
  constructor(private apiService: ApiService, private router: Router,public translate: TranslateService,
    private commonMtd: CommonMethodsService) {
    commonMtd.addIndexMeta();
    this.common = new CommonMethods(router);
    translate.use(localStorage.getItem('language'));

  }

  ngOnInit(): void {
    if(localStorage.getItem('language') == 'fr'){
      this.constant = prismicFrConstants
      this.langkey = 'fr-fr'
    }else{
      this.constant = prismicEnConstants
      this.langkey = 'en-us'
    }

    this.getPrismicDatas();
    let currPrd = JSON.parse(localStorage.getItem('currPrd'));
    if (currPrd != null) {
      this.cartDetails.push(currPrd);
      this.cartCount.subTotal = currPrd.total;
    } else {
      this.cartDetails = JSON.parse(localStorage.getItem('cartDetails'));
      this.cartCount = JSON.parse(localStorage.getItem('cartCount'));
    }
    this.total = (parseFloat(this.cartCount?.subTotal) + this.shipping).toFixed(2);
    let info = JSON.parse(localStorage.getItem('info'));
    if (info != null) {
      this.contact = info.email;
      this.address = info.address1 + (info.suite ? (", " + info.suite) : '') + ", "
        + info.city + ", " + info.country.name + ", " + info.province + ", " + info.zip;
    }
    this.common.clear();
  }
  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }
  changeContact() {
    localStorage.setItem('change', 'contact');
    this.common.navigate('/checkout-information');
  }

  changeAddress() {
    localStorage.setItem('change', 'address');
    this.common.navigate('/checkout-information');
  }

  onClickShipping() {
    this.common.navigate('/checkout-shipping');
  }

  onClickInfo() {
    this.common.navigate('/checkout-information');
  }
  onClickCart() {
    this.common.navigate('/cart-page');
  }

  onClickPay() {

  }

  getPrismicDatas() {
    let ogSection: any;
    let seoSection: any;
    let twitterSection: any;
    let id = this.constant['checkoutPayment']
    let lang = this.langkey
    return Prismic.api("https://9mmenergydrink.prismic.io/api/v2").then(function (api) {
      return api.query(Prismic.Predicates.at('document.id', id),{ lang : lang});
    }).then((function (response) {
      if(response?.results[0]?.data?.page_title){
        this.pageTitle = response.results[0].data.page_title
      }
      response.results[0]?.data?.body.forEach(prismic => {
        switch (prismic.slice_type) {
          case 'seo_section':
            console.log("seosection:", prismic);
           seoSection = prismic;
            break;
          case 'og_section':
            console.log("ogsection:", prismic);
           ogSection = prismic;
            break;
            case 'twitter_section':          
             twitterSection = prismic;
              break;
          default:
            console.log("type:", prismic)
        }
      })
      this.commonMtd.addMetaTag(seoSection, ogSection, twitterSection);
    }).bind(this), function (err) {
      console.log("Something went wrong: ", err);
    });
  }
  isCollapsed=true;
}
