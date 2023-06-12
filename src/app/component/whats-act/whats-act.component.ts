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
  selector: 'app-whats-act',
  templateUrl: './whats-act.component.html',
  styleUrls: ['./whats-act.component.css']
})
export class WhatsActComponent implements OnInit{
  pageTitle = "";
  headerSection: any;
  footerSection: any;
  cartCount;// = JSON.parse(localStorage.getItem('cartCount'));
  bannerSection;
  productSection;
  skillSection:any;
  serviceSection;
  socialProofSection: any;
  constant: any;
  langkey: any;
  clientSection;
  apiUrl;
  common: CommonMethods;
  constructor(private router:Router,private modalService: NgbModal, public commonMtd: CommonMethodsService) {
    this.cartCount = commonMtd.getCartCountDetails();
    commonMtd.addIndexMeta(true);
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
  playVideo(url) {
    const modalRef = this.modalService.open(VideoPopupComponent, { size: 'xl',centered: true,windowClass: 'modal-custom'});
    modalRef.componentInstance.setVideoUrl = url;
  }
  gotoShop(){
    // this.common.navigate('/read-more', "whats-act");
    this.router.navigate([this.commonMtd.getRoutePath('shop')], { fragment: 'down' });
  }
  getPrismicDatas(){
    let ogSection: any;
    let seoSection: any;
    let twitterSection: any;
    let id = this.constant['whatsActId']
    let lang = this.langkey
    return Prismic.api(this.apiUrl).then(function (api) {
      return api.query(Prismic.Predicates.at('document.id', id),{ lang : lang});
    }).then((function (response) {
      if(response?.results[0]?.data?.page_title){
        this.pageTitle = response.results[0].data.page_title
      }
      response.results[0]?.data?.body.forEach(prismic => {
        switch(prismic.slice_type){
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
          case 'product_section':
            this.productSection = prismic;
            break;
          case 'skill_section':
            this.skillSection = JSON.parse(JSON.stringify(prismic));
            break;
            case 'service_section':
           this.serviceSection = prismic;
           break;
           case 'client_section':
         this.clientSection = prismic;
         break;
         case 'social_proof_section':
              this.socialProofSection = prismic;
              break;
         default:
              console.log("type:",prismic)
        }
      })
      this.commonMtd.addMetaTag(seoSection, ogSection, twitterSection);

      this.skillSection?.items?.forEach(item=>{
        item.percent = item?.percentage+'%';
      })
    }).bind(this), function (err) {
      console.log("Something went wrong: ", err);
    });
  }
  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  ngOnDestroy() {
    this.modalService.dismissAll();
  }
}
