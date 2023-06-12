import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import Prismic from 'prismic-javascript';
import { CommonMethods } from 'src/app/common/common-methods';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { prismicEnConstants } from 'src/app/common/prismic-Enconstants';
import { prismicFrConstants } from 'src/app/common/prismic-Frconstants';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { Subscription } from 'rxjs';
import { CommonMethodsService } from 'src/app/shared/common-methods/common-methods.service';
import { TranslateService } from '@ngx-translate/core';
import { PopupFormComponent } from 'src/app/shared/popup/popup-form/popup-form.component';
declare let $:any;

@Component({
  selector: 'app-affiliate',
  templateUrl: './affiliate.component.html',
  styleUrls: ['./affiliate.component.css']
})

export class AffiliateComponent implements OnInit {

  @ViewChild('fondovalor') fondovalor:ElementRef;
  pageTitle= "";
  headerSection: any;
  footerSection: any;
  bannerSection;
  worksSection;
  callToAction1;
  programTitle;
  programSection;
  callToAction2;
  subscriptionSection;
  socialProofSection;
  constant: any;
  langkey: any;
  apiUrl: any;
  isSubmitted= false;
  cartCount;// = JSON.parse(localStorage.getItem('cartCount'));
  formGroup: FormGroup;
  common: CommonMethods;
  subScription: Subscription;
  affiliateUrl;
  constructor(public translate: TranslateService, private router: Router,private modalService: NgbModal,config: NgbModalConfig,
    private service: ApiService,  private toastr: ToastrService, public commonMtd: CommonMethodsService) {
      this.cartCount = commonMtd.getCartCountDetails();
      commonMtd.addIndexMeta(true);
      this.common = new CommonMethods(router);
  }

  ngOnInit(): void {
   /* let chatScript = document.createElement("script");
chatScript.type = "text/javascript";
chatScript.src = "https://static.leaddyno.com/js";
document.body.appendChild(chatScript);

chatScript = document.createElement("script");
chatScript.type = "text/javascript";
chatScript.text = `LeadDyno.key = "601073bf5122cf9020fe4474f022f565f34623f4";
LeadDyno.recordVisit();
LeadDyno.autoWatch();`
document.body.appendChild(chatScript);*/

    this.formGroup = new FormGroup({
      'email': new FormControl(null, Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]))
    });
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
  get f() {
    return this.formGroup.controls;
  }
  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }
  gotoReadMore(){
    // this.common.navigate('/read-more', "about");
    this.router.navigate([this.commonMtd.getRoutePath('shop')], { fragment: 'down' });
  }
  open(content) {
   // this.modalService.open(content, { centered: true });
  }
 
  getPrismicDatas() {
    let ogSection: any;
    let seoSection: any;
    let twitterSection: any;
    let lContentSection;
    let id = this.constant['affiliateId'];
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
          case 'og_section':
            ogSection = prismic;
            break;
          case 'twitter_section':       
            twitterSection = prismic;
            break;
          case 'banner_section':
            this.bannerSection = prismic;
            break;
          case 'workssection':
            this.worksSection = prismic;
            break;
          case 'call_to_action_1':
            this.callToAction1 = prismic;
            break;
          case 'affiliate_program_section':
            
            lContentSection = prismic;
            this.programTitle=prismic?.primary?.title;
            console.log("accordion_section:", this.programTitle)
            break;
          case 'call_to_action_2':
            this.callToAction2 = prismic;
            break;
          case 'subscription_section':
            this.subscriptionSection = prismic;
            break;
          case 'social_proof_section':
            this.socialProofSection = prismic;
            break;
          default:
            console.log("affiliate:", prismic)
        }
      })
      this.commonMtd.addMetaTag(seoSection, ogSection, twitterSection);
      let tContent = [];
        let lIndex;
        lContentSection?.primary?.content?.forEach((item,index) => {
          let txt = "";
          let prev = 0;
          if(!item.type.includes("heading")){
            item.isInnerHtml = false;
            
          for(let s of item.spans){
            if(s.type == "strong"){
              item.isInnerHtml = true;
              txt += '<span>' + item.text.substring(prev,s.start);
              txt += "<b>" + item.text.substring(s.start,s.end) + "</b>";
              prev = s.end;
            }else if(s.type == "hyperlink"){
               item.isInnerHtml = true;
              txt += '<span>' + item.text.substring(prev,s.start);
              txt += '<a class="blog-link" href="'+ s.data.url +'" target="_blank">' + item.text.substring(s.start,s.end) + "</a>";
              prev = s.end;
            }
          }
          if(item.isInnerHtml){
           txt += item.text.substring(prev,item.text.length) + '</span>'; 
           item.text = txt;
           if(item.text.includes('\n')){
             item.text = item.text.replace(/\/n/g, "<br> &nbsp;&nbsp;&nbsp;");
           }
           
          }
        }

        if(item.text.includes('\n') && !item.isInnerHtml){
          item.isInnerHtml = true;
          item.text = item.text.replace(/\/n/g, "<br> &nbsp;&nbsp;&nbsp;");
          item.text = '<span>' + item.text + '</span>';
        }
		         
         // 

          if(item.type == "list-item" || item.type == "o-list-item"){
            if(!lIndex){
              lIndex = tContent.length;
              item.list = [];
              item.list.push(item);
              tContent.push(item);
            }else{
              tContent[lIndex].list.push(item);
            } 
          }else{
            lIndex = null;
            tContent.push(item);
          }
        })
        this.programSection = tContent;

        this.affiliateUrl = lContentSection?.primary?.affiliate_url?.url;
        $(lContentSection?.primary?.leaddyno_script1).appendTo(document.body);
        $(lContentSection?.primary?.leaddyno_script2).appendTo(document.body);
    }).bind(this), function (err) {
      console.log("Something went wrong: ", err);
    });
  }
isShow(i){
  if(this.programSection.length>(i+1)&&this.programSection[i+1].type.includes('heading') ||
  this.programSection.length-1 == i){
    return true;
  }
  else{
    return false;
  }
}

// expand(item) {
//   item.showDetails = item.showDetails?!item.showDetails:true;
//   <i [ngClass]="{'fa fa-angle-down'}" class="float-right" ></i>
// }
subscribe() {
  this.isSubmitted = true;
  if(this.formGroup.valid){
    this.subScription = this.service.subscribeNewsletter(this.formGroup.value.email).subscribe((res: any) => {
      console.log(res);
      if (res.status === "7400") {
        this.toastr.success(this.translate.instant('newsletterSubscribed'));
        this.formGroup.reset();
      }
      else {
        this.toastr.error(res.message, this.translate.instant('error'));
      }
      this.isSubmitted = false;
    }, err => {

    })
  }
}

openPopupForm(formScript) {
  if (formScript) {
    const modalRef = this.modalService.open(PopupFormComponent, {windowClass: "zohoPopupFormCustomCss"});
    modalRef.componentInstance.script = formScript;
  }
}

ngOnDestroy() {
  this.modalService.dismissAll();
}
}
