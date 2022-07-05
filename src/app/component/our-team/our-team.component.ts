import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Prismic from 'prismic-javascript';
import { CommonMethods } from 'src/app/common/common-methods';
import { prismicEnConstants } from 'src/app/common/prismic-Enconstants';
import { prismicFrConstants } from 'src/app/common/prismic-Frconstants';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  readMoreSection;
  teamSection;
  constant: any;
  langkey: any;
  cartCount;// = JSON.parse(localStorage.getItem('cartCount'));
  common: CommonMethods;
  constructor(private router: Router,private modalService: NgbModal,config: NgbModalConfig, 
    private commonMtd: CommonMethodsService) {
      this.cartCount = commonMtd.getCartCountDetails();
    commonMtd.addIndexMeta();
    this.common = new CommonMethods(router);
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
    this.common.clear();
  }
  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }
  gotoReadMore(){
    // this.common.navigate('/read-more', "about");
    // this.router.navigate(['/shop'], { fragment: 'down' });
  }
  // open(content) {
  //   this.modalService.open(content, { centered: true });
  // }
  
  getPrismicDatas() {
    let ogSection: any;
    let seoSection: any;
    let twitterSection: any;
    let id = this.constant['ourTeam']
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
           seoSection = prismic;
            break;
          case 'og_section':
           ogSection = prismic;
            break;
          case 'twitter_section':             
           twitterSection = prismic;
            break;
          case 'banner_section':
            console.log("banner_section:", prismic);
            this.bannerSection = prismic;
            break;
          case 'read_more_section':
            console.log("read_more_section:", prismic);
            this.readMoreSection = prismic;
            break;
          case 'aboutussection':
            console.log("aboutussection:", prismic);
            this.aboutusSection = prismic;
            break;
          case 'team_section':
            console.log("team_section:", prismic);
            this.teamSection = prismic;
            break; 
          case 'advisors_section':
            console.log("advisors_section:", prismic);
            this.advisorsSection = prismic;
            break;
          case 'works_section':
            console.log("works_section:", prismic)
            this.worksSection = prismic;
          break;
          case 'creative_section':
            console.log("creative_section:", prismic);
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
