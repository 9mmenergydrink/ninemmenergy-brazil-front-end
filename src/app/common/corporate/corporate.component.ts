import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Prismic from 'prismic-javascript';
import { CommonMethods } from 'src/app/common/common-methods';
import { prismicEnConstants } from 'src/app/common/prismic-Enconstants';
import { prismicFrConstants } from 'src/app/common/prismic-Frconstants';
import { CommonMethodsService } from 'src/app/shared/common-methods/common-methods.service';
import { VideoPopupComponent } from 'src/app/shared/popup/video-popup/video-popup.component';
@Component({
  selector: 'app-corporate',
  templateUrl: './corporate.component.html',
  styleUrls: ['./corporate.component.css']
})
export class CorporateComponent implements OnInit {

  pageTitle = "";
  headerSection: any;
  footerSection: any;
  bannerSection;
  aboutusSection;
  iconSection;
  creativeSection: any;
  teamSection:any;
  testimonialSection;
  socialProofSection;
  cartCount;// = JSON.parse(localStorage.getItem('cartCount'));
  common;
  language: any;
  constant: any;
  langkey: any;
  apiUrl: any;
  constructor(private router: Router,private commonMtd:CommonMethodsService,private modalService: NgbModal) {
    this.cartCount = commonMtd.getCartCountDetails();
    commonMtd.addIndexMeta(true, true);
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
  }
  getPrismicDatas() {
    let ogSection: any;
    let seoSection: any;
    let twitterSection: any;
    let id = this.constant['corporateId']
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
          case 'aboutussection':
              console.log("aboutusSection:", prismic);
              this.aboutusSection = prismic;
              break;
          case 'creative_section':
            console.log("creativeSection:", prismic)
            this.creativeSection = prismic;
          break;
          case 'team_section':
            console.log("teamSection:", prismic)
            this.teamSection = prismic;
          break;
          case 'testimonialsection':
            this.testimonialSection = prismic;
            break;
          case 'social_proof_section':
            console.log("socialProofSection:", prismic)
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

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  gotoReadMore(){
    // this.common.navigate('/read-more', "about");
    this.router.navigate([this.commonMtd.getRoutePath('shop')], { fragment: 'down' });
  }

  playVideo(url) {
    const modalRef = this.modalService.open(VideoPopupComponent, { size: 'xl',centered: true,windowClass: 'modal-custom'});
    modalRef.componentInstance.setVideoUrl = url;
  }

}
