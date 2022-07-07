import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Prismic from 'prismic-javascript';
import { CommonMethods } from 'src/app/common/common-methods';
import { prismicEnConstants } from 'src/app/common/prismic-Enconstants';
import { prismicFrConstants } from 'src/app/common/prismic-Frconstants';
import { CommonMethodsService } from 'src/app/shared/common-methods/common-methods.service';

@Component({
  selector: 'app-clinical-studies',
  templateUrl: './clinical-studies.component.html',
  styleUrls: ['./clinical-studies.component.css']
})
export class ClinicalStudiesComponent implements OnInit {
  pageTitle = "";
  headerSection: any;
  footerSection: any;
  cartCount;// = JSON.parse(localStorage.getItem('cartCount'));
  bannerSection;
  callToActionSection;
  clinicalStudiesSection;
  constant: any;
  langkey: any;
  clinicalStudiesHeader: any;
  common: CommonMethods;
  apiUrl: any;

  constructor(private router: Router, private commonMtd:CommonMethodsService) { 
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

  getPrismicDatas(){
    let ogSection: any;
    let seoSection: any;
    let twitterSection: any;
    let clinicalStudiesList;
    let id = this.constant['clinicalStudiesId'];
    let lang = this.langkey;
    return Prismic.api(this.apiUrl).then(function (api) {
      return api.query(Prismic.Predicates.at('document.id', id),{ lang : lang});
    }).then((async function (response) {
      if(response?.results[0]?.data?.page_title){
        this.pageTitle = response.results[0].data.page_title
      }
      response.results[0]?.data?.body.forEach(prismic => {
        switch(prismic.slice_type){
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
            case 'clinical_studies':            
              this.clinicalStudiesHeader = prismic;
              break;
          case 'call_to_action':
            console.log("callToActionSection:",prismic)
                this.callToActionSection = prismic;
                break;
         default:
            //  console.log("type:",prismic)
        }
      })
      this.commonMtd.addMetaTag(seoSection, ogSection, twitterSection);
      clinicalStudiesList = await this.commonMtd.getPrismicDatas("clinical_studies_details");
      console.log("clinicalStudiesList",clinicalStudiesList);
      // let categoryData = categoryInfo['data'];
      let clinicalStudies=[];
      
      for (let data of clinicalStudiesList) {
        
        let clinicalStudiesData= data['data'];
        for(let obj in clinicalStudiesData){
          if (obj != null && obj.indexOf('body') > -1 && !Number.isNaN(obj.replace("body", ""))) {
            let prismic = clinicalStudiesData[obj]?.length > 0
              ? clinicalStudiesData[obj][0]
              : "";
          // console.log("prismic.slice_type",prismic);
          switch (prismic.slice_type) {
            case 'clinical_studies':   
                     prismic.uid = data.uid;
                     prismic.en_uid= data.en_uid;
            clinicalStudies.push(prismic);
            
              break;
                  default:
          }  
        }}
      }
      console.log("pusheddata", clinicalStudies);
      this.clinicalStudiesSection =  clinicalStudies;
    }).bind(this), function (err) {
      console.log("Something went wrong: ", err);
    });
    
  }

  goToInner(item) {  
    localStorage.setItem("studyName", item.title);   
    this.router.navigateByUrl(this.commonMtd.getRoutePath('clincialinner')); //'/clinical-studies-inner'
}

gotoShop(){
  this.router.navigate([this.commonMtd.getRoutePath('shop')], { fragment: 'down' });
}

scroll(el: HTMLElement) {
  el.scrollIntoView();
}

}
