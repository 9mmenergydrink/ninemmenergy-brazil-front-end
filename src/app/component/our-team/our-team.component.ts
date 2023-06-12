import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Prismic from 'prismic-javascript';
import { CommonMethods } from 'src/app/common/common-methods';
import { CommonMethodsService } from 'src/app/shared/common-methods/common-methods.service';

@Component({
  selector: 'app-our-team',
  templateUrl: './our-team.component.html',
  styleUrls: ['./our-team.component.css']
})
export class OurTeamComponent implements OnInit {
  pageTitle = "";
  headerSection: any;
  footerSection: any;
  bannerSection;
  aboutusSection;
  advisorsSection;
  creativeSection;
  worksSection;
  teamSection;
  constant: any;
  langkey: any;
  apiUrl: any;
  cartCount;// = JSON.parse(localStorage.getItem('cartCount'));
  common: CommonMethods;
  constructor(private router: Router, public commonMtd: CommonMethodsService) {
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
  
  getPrismicDatas() {
    let ogSection: any;
    let seoSection: any;
    let twitterSection: any;
    let id = this.constant['ourTeam']
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
          case 'aboutussection':
            this.aboutusSection = prismic;
            break;
          case 'team_section':
            this.teamSection = prismic;
            break; 
          case 'advisors_section':
            this.advisorsSection = prismic;
            break;
          case 'works_section':
            this.worksSection = prismic;
          break;
          case 'creative_section':
            this.creativeSection = prismic;
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
