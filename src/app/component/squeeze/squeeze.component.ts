import { Component, OnInit } from '@angular/core';
import Prismic from 'prismic-javascript';
import { Router } from '@angular/router';
import { CommonMethods } from 'src/app/common/common-methods';
import { CommonMethodsService } from 'src/app/shared/common-methods/common-methods.service';
@Component({
  selector: 'app-squeeze',
  templateUrl: './squeeze.component.html',
  styleUrls: ['./squeeze.component.css']
})
export class SqueezeComponent implements OnInit {
  pageTitle = "";
  headerSection: any;
  footerSection: any;
  bannerSection: any;
  socialProofSection: any;
  constant: any;
  langkey: any;
  apiUrl: any;
  cartCount;// = JSON.parse(localStorage.getItem('cartCount'));
  common: CommonMethods;
  constructor(private router: Router, private commonMtd:CommonMethodsService) { 
    this.cartCount = commonMtd.getCartCountDetails();
    commonMtd.addIndexMeta();
    this.common = new CommonMethods(router);
  }

  ngOnInit(): void {
    let domainLanguage = this.commonMtd.getSubDomainLanguage();
    this.constant = domainLanguage.constant;
    this.langkey = domainLanguage.langkey;
    this.apiUrl = domainLanguage.apiUrl;

    this.getPrismicDatas();
    this.common.clear();
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  gotoReadMore() {
    this.router.navigate([this.commonMtd.getRoutePath('shop')], { fragment: 'down' });
  }

  getPrismicDatas() {
    let ogSection: any;
    let seoSection: any;
    let twitterSection: any;
    let id = this.constant['squeezeId'];
    let lang = this.langkey
    return Prismic.api(this.apiUrl).then(function (api) {
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
          case 'banner_section':
            console.log("bannersection:", prismic)
            this.bannerSection = prismic;
            break;
          case 'social_proof_section':
            console.log("prismic:", prismic)
            this.socialProofSection = prismic;
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

}
