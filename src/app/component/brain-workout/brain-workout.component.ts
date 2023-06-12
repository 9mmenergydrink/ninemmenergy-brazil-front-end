import { Component, OnInit } from '@angular/core';
import Prismic from 'prismic-javascript';
import "@lottiefiles/lottie-player";
import { Router } from '@angular/router';
import { CommonMethods } from 'src/app/common/common-methods';
import { prismicEnConstants } from 'src/app/common/prismic-Enconstants';
import { prismicFrConstants } from 'src/app/common/prismic-Frconstants';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VideoPopupComponent } from 'src/app/shared/popup/video-popup/video-popup.component';
import { CommonMethodsService } from 'src/app/shared/common-methods/common-methods.service';

@Component({
  selector: 'app-brain-workout',
  templateUrl: './brain-workout.component.html',
  styleUrls: ['./brain-workout.component.css']
})
export class BrainWorkoutComponent implements OnInit {
  pageTitle = "";
  headerSection: any;
  footerSection: any;
  bannerSection: any;
  productSection: any;
  contentSection: any;
  serviceSection: any;
  constant: any;
  langkey: any;
  apiUrl: any;
  clientSection: any;
  content: string;
  cartCount;// = JSON.parse(localStorage.getItem('cartCount'));
  common: CommonMethods;
  // show: boolean = false;
  // hide: boolean = true;
  // buttonShow:boolean;
  constructor(private router: Router,private modalService: NgbModal, public commonMtd: CommonMethodsService) {
    this.cartCount = commonMtd.getCartCountDetails();
    commonMtd.addIndexMeta(true);
    this.common = new CommonMethods(router);
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
    this.common.clear();
  }
  playVideo(url) {
    const modalRef = this.modalService.open(VideoPopupComponent, { size: 'xl',centered: true,windowClass: 'modal-custom'});
    modalRef.componentInstance.setVideoUrl = url;
  }
  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }
  gotoShop(){
    // this.common.navigate('/read-more', "brain-workout");
    this.router.navigate([this.commonMtd.getRoutePath('shop')], { fragment: 'down' });
  }
  getClass(i){
    if(i >2){
      return false
    }else{
      return true;
    }
  }

  getPrismicDatas() {
    let ogSection: any;
    let seoSection: any;
    let twitterSection: any;
    let id = this.constant['brainWorkoutId'];
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
            console.log("seosection:", prismic);
            seoSection = prismic;
            break;
          case 'ogsection':
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
          case 'read_more_section':
            console.log("read_more_section:", prismic);
            this.readMoreSection = prismic;
            break;
          case 'product_section':
            console.log("product_section:", prismic)
            this.productSection = prismic;
            break;
          case 'commercial_content':
            console.log("commercial_content:", prismic)
            this.contentSection = prismic;
            break;
          case 'service_section':
            console.log("service_section:", prismic)
            this.serviceSection = prismic;
            break;
          case 'client_section':
            console.log("client_section:", prismic)
            this.clientSection = prismic;
            break;
          default:
            console.log("type:", prismic)
        }
      })
      this.commonMtd.addMetaTag(seoSection, ogSection, twitterSection);
      /*this.content = this.contentSection?.primary?.content.substring(0, 304);
      if (this.contentSection?.primary?.content?.length > 304) {
        this.buttonShow = true;
      }
      else {
        this.buttonShow = false;
      }*/

      //show readmore button if the content greater than the image
      setTimeout(() => {
          // 20px for read more button margin top, and 20px for adjustment
          let imgHeight = document.getElementById("readmoreImg")['offsetHeight'];
          let contentHeight = document.getElementById("readmoreContent")['offsetHeight'];
          let btnHeight = document.getElementById("readmoreBtn")['offsetHeight'] + 40;
          if (imgHeight < contentHeight) {
            this.contentSection.primary['show'] = true;
            this.contentSection.primary['isRead'] = false;
          }
          else {
            this.contentSection.primary['show'] = false;
            this.contentSection.primary['isRead'] = true;
          }
          this.contentSection.primary['height'] = (imgHeight-btnHeight-6) + 'px';
      }, 1750);
      this.contentSection = JSON.parse(JSON.stringify(this.contentSection));
    }).bind(this), function (err) {
      console.log("Something went wrong: ", err);
    });
  }

  /*readMore() {
    this.show = true;
    this.hide = false;
  }

  readLess() {
    this.show = false;
    this.hide = true;
  }*/

  onClickRead(){
    if(this.contentSection?.primary?.isRead != null ){
      return this.contentSection.primary['isRead'] = !this.contentSection.primary['isRead'];
    }else{
      return false;
    }
  }

  ngOnDestroy() {
    this.modalService.dismissAll();
  }
}
