import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Prismic from 'prismic-javascript';
import { CommonMethods } from 'src/app/common/common-methods';
import { prismicEnConstants } from 'src/app/common/prismic-Enconstants';
import { prismicFrConstants } from 'src/app/common/prismic-Frconstants';
import { CommonMethodsService } from 'src/app/shared/common-methods/common-methods.service';
declare let $:any;

@Component({
  selector: 'app-social-responsibility',
  templateUrl: './social-responsibility.component.html',
  styleUrls: ['./social-responsibility.component.css']
})
export class SocialResponsibilityComponent implements OnInit {
  pageTitle = "";
  headerSection: any;
  footerSection: any;
  bannerSection;
  worksSection: any;
  messageSection;
  constant: any;
  langkey: any;
  apiUrl: any;
  cartCount;// = JSON.parse(localStorage.getItem('cartCount'));

  constructor(private router: Router, public commonMtd: CommonMethodsService) { 
    this.cartCount = commonMtd.getCartCountDetails();
    commonMtd.addIndexMeta(true, true);
  }

  ngOnInit(): void {
    // if(localStorage.getItem('language') == 'fr'){
    //   this.constant = prismicFrConstants
    //   this.langkey = 'fr-fr'
    // }else{
    //   this.constant = prismicEnConstants
    //   this.langkey = 'en-us'
    // }
    let domainLanguage = this.commonMtd.getSubDomainLanguage();
    this.constant = domainLanguage.constant;
    this.langkey = domainLanguage.langkey;
    this.apiUrl = domainLanguage.apiUrl;


    this.getPrismicDatas();
  }

  getPrismicDatas() {
    let ogSection: any;
    let seoSection: any;
    let twitterSection: any;
    let id = this.constant['socialResId'];
    let lang = this.langkey;
    return Prismic.api(this.apiUrl).then(function (api) {
      return api.query(Prismic.Predicates.at('document.id', id),{ lang : lang});
    }).then((function (response) {
      if(response?.results[0]?.data?.page_title){
        this.pageTitle = response.results[0].data.page_title
      }
      response.results[0]?.data?.body.forEach(prismic => {
        switch (prismic.slice_type) {
          case 'seo_section':
            seoSection = prismic;
            break;
          case 'ogsection':
            ogSection = prismic;
            break;
          case 'twitter_section':               
            twitterSection = prismic;
            break;
          case 'banner_section':
            console.log("banner_section:", prismic);
            this.bannerSection = prismic;
            break;
          case 'workssection':
            console.log("works_section:", prismic)
            this.worksSection = prismic;
            break;
          case 'messagesection':
            console.log("messagesection:", prismic);
            this.messageSection = prismic;
            break;
          default:
            console.log("type:", prismic)
        }
      })
      this.commonMtd.addMetaTag(seoSection, ogSection, twitterSection);
      this.desktopMobile();
    }).bind(this), function (err) {
      console.log("Something went wrong: ", err);
    });
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  gotoReadMore(){
    // this.common.navigate('/read-more', "about");
    this.router.navigate([this.commonMtd.getRoutePath('shop')], { fragment: 'down' });
  }

  desktopMobile() {
    // var isAndroid = navigator.userAgent.match(/Android/i);
    // var isIOS = navigator.userAgent.match(/iPhone|iPad|iPod/i);
    var isMobile = navigator.userAgent.match(/Mobile|Android|iPhone|iPod/i);
    var isIpad = navigator.userAgent.match(/iPad/i);
    if(isMobile && (isIpad == null)) {
      var message_script = this.messageSection?.primary?.mobile_script;
    } else {
      var message_script = this.messageSection?.primary?.desktop_script;
    }
    $("#ontrapoet").append(message_script);
  }
}
