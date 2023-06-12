import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Prismic from 'prismic-javascript';
import { CommonMethods } from 'src/app/common/common-methods';
import { prismicEnConstants } from 'src/app/common/prismic-Enconstants';
import { prismicFrConstants } from 'src/app/common/prismic-Frconstants';
import { CommonMethodsService } from 'src/app/shared/common-methods/common-methods.service';

@Component({
  selector: 'app-our-products',
  templateUrl: './our-products.component.html',
  styleUrls: ['./our-products.component.css']
})
export class OurProductsComponent implements OnInit {
  pageTitle = "";
  headerSection: any;
  footerSection: any;
  bannerSection;
  creativeSection;
  iconSection;
  worksSection: any;
  ourProductSection:any;
  sponserSection;
  cartCount;// = JSON.parse(localStorage.getItem('cartCount'));
  common;
  language: any;
  constant: any;
  langkey: any;
  apiUrl: any;
  constructor(private router: Router,public commonMtd: CommonMethodsService) {
    this.cartCount = commonMtd.getCartCountDetails();
    commonMtd.addIndexMeta(true, true);
   }

  ngOnInit(): void {
    let domainLanguage = this.commonMtd.getSubDomainLanguage();
    this.constant = domainLanguage.constant;
    this.langkey = domainLanguage.langkey;
    this.apiUrl = domainLanguage.apiUrl;
    this.getPrismicDatas();
    this.common.clear();
  }
  getPrismicDatas() {
    let ogSection: any;
    let seoSection: any;
    let twitterSection: any;
    let id = this.constant['ourProductId']
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
          case 'our_product_section':
            this.ourProductSection = prismic;
          break;
          
          case 'workssection':
            this.worksSection = prismic;
          break;

          case 'icon_section':
            this.iconSection = prismic;
          break;
          case 'sponsorsection':
            this.sponserSection = prismic;
          break;
            
          default:
            console.log("type:", prismic)
        }
      })
      setTimeout(() => {
        this.worksSection?.items?.forEach((item,i) => {
          // 20px for read more button margin top, and 20px for adjustment
          let bh = document.getElementById("wb" + (i+1))['offsetHeight'] + 40;
          let th = document.getElementById("wi" + (i+1))['offsetHeight'];
          if (th < document.getElementById("wc" + (i+1))['offsetHeight']) {
            item.show = true;
            item.isRead = false;
          }
          else {
            item.show = false;
            item.isRead = true;
          }
          item.height = (th-bh-6) + 'px';
        })
      }, 1750);
      this.commonMtd.addMetaTag(seoSection, ogSection, twitterSection);
    }).bind(this), function (err) {
      console.log("Something went wrong: ", err);
    });
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }
  onClickRead(i){
    if(this.worksSection?.items[i]?.isRead != null ){
     return this.worksSection.items[i].isRead = !this.worksSection.items[i].isRead;
   }else{
     return false;
   }
 }
  gotoReadMore(){
    // this.common.navigate('/read-more', "about");
    this.router.navigate([this.commonMtd.getRoutePath('shop')], { fragment: 'down' });
  }


}
