import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Prismic from 'prismic-javascript';
import { CommonMethods } from 'src/app/common/common-methods';
import { prismicEnConstants } from 'src/app/common/prismic-Enconstants';
import { prismicFrConstants } from 'src/app/common/prismic-Frconstants';
import { CommonMethodsService } from 'src/app/shared/common-methods/common-methods.service';
@Component({
  selector: 'app-whats-inside',
  templateUrl: './whats-inside.component.html',
  styleUrls: ['./whats-inside.component.css']
})
export class WhatsInsideComponent implements OnInit {

  pageTitle = "";
  headerSection: any;
  footerSection: any;
  bannerSection;
  creativeSection;
  folksSection;
  worksSection: any;
  productSection;
  cartCount;// = JSON.parse(localStorage.getItem('cartCount'));
  common;
  language: any;
  constant: any;
  langkey: any;
  apiUrl: any;
  constructor(private router: Router,private commonMtd:CommonMethodsService) { }

  ngOnInit(): void {
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
    let id = this.constant['whatsInsideId']
    let lang = this.langkey
    return Prismic.api(this.apiUrl).then(function (api) {
      return api.query(Prismic.Predicates.at('document.id', id),{ lang : lang});
    }).then((function (response) {
      console.log("response", response)
      if(response?.results[0]?.data?.page_title){
        this.pageTitle = response.results[0].data.page_title
      }
      response.results[0]?.data?.body.forEach(prismic => {
        switch (prismic.slice_type) {
          case 'seosection':
           seoSection = prismic;
            break;
          case 'ogsection':
           ogSection = prismic;
            break;
            case 'twitter_section':               
             twitterSection = prismic;
              break;
          case 'banner_section':
            this.bannerSection = prismic;
            break;
          case 'creative_section':
              this.creativeSection = prismic;
              break;
          case 'workssection':
            this.worksSection = prismic;
          break;
          case 'folkssection':
            this.folksSection = prismic;
          break;
          case 'product_section':
            this.productSection = prismic;
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

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  gotoReadMore(){
    // this.common.navigate('/read-more', "about");
    this.router.navigate([this.commonMtd.getRoutePath('shop')], { fragment: 'down' });
  }

}
