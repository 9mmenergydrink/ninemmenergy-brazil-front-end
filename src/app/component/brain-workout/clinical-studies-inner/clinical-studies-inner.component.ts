import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Prismic from 'prismic-javascript';
import { environment } from 'src/environments/environment';
import { prismicEnConstants } from 'src/app/common/prismic-Enconstants';
import { prismicFrConstants } from 'src/app/common/prismic-Frconstants';
import { CommonMethodsService } from 'src/app/shared/common-methods/common-methods.service';


@Component({
  selector: 'app-clinical-studies-inner',
  templateUrl: './clinical-studies-inner.component.html',
  styleUrls: ['./clinical-studies-inner.component.css']
})
export class NeuroClinicalStudiesInnerComponent implements OnInit {
  pageTitle = "";
  headerSection: any;
  footerSection: any;
  studyDetails;
  cartCount;// = JSON.parse(localStorage.getItem('cartCount'));
  constant: any;
  langkey: any;
  constructor(private router: Router,public commonMtd: CommonMethodsService, private route: ActivatedRoute) {
    this.cartCount = commonMtd.getCartCountDetails();
    commonMtd.addIndexMeta(true, true);
   }

  ngOnInit(): void {
   // let studyName = localStorage.getItem("studyName");
    
    let studyName = this.route.snapshot.params['title'];
    if(studyName){ 
      studyName = studyName!=null?studyName.replace(/-/g, " "):"";
    if(localStorage.getItem('language') == 'fr'){
      this.constant = prismicFrConstants
      this.langkey = 'fr-fr'
    }else{
      this.constant = prismicEnConstants
      this.langkey = 'en-us'
    }
    let data = localStorage.getItem("isLoadingFirst")
    if(data == 'false')
    return;
    this.getPrismicDatas(studyName);
  }
  }

  async  getPrismicDatas(studyName){
    let ogSection: any;
    let seoSection: any;
    let twitterSection: any;
    let clinicalStudiesList;
    let clinicalStudiesData
      clinicalStudiesList = await this.commonMtd.getPrismicDatas("neurotracker_clinical_studies_details");
  
      for (let item of clinicalStudiesList) {
  
  
        item.uid = item.uid!=null?item.uid.replace(/-/g, " "):"";
        console.log(item, studyName);
        console.log( item?.uid?.toLowerCase(), studyName.toLowerCase() )
        if((environment.mainDomain.includes(window.location.origin) && item?.data?.en_uid?.toLowerCase() == studyName.toLowerCase())
          || item?.uid?.toLowerCase() == studyName.toLowerCase()){
           clinicalStudiesData= item['data'];
          for(let obj in clinicalStudiesData){
            console.log("obj", obj)
          if (obj != null && obj.indexOf('body') > -1 && !Number.isNaN(obj.replace("body", ""))) {
            let prismic = clinicalStudiesData[obj]?.length > 0
            ? clinicalStudiesData[obj][0]
            : "";
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
  
              case 'neurotracker_clinical_studies_details':
              prismic.primary.studies_name = clinicalStudiesData.neurotracker_clinical_studies_name[0].text;
              this.studyDetails = prismic;
              
                break;
                    default:
            }
          }
        }
      }
      }
      if(!clinicalStudiesData){
        this.router.navigateByUrl("/**");
      }
      this.commonMtd.addMetaTag(seoSection, ogSection, twitterSection);
    }

  // getPrismicDatas(studyName){
  //   let id = this.constant['neurotrackerClinicalStudiesId'];
  //   let lang = this.langkey;
  //   return Prismic.api("https://9mmenergydrink.prismic.io/api/v2").then(function (api) {
  //     return api.query(Prismic.Predicates.at('document.id', id),{ lang : lang});
  //   }).then((function (response) {
  //     if(response?.results[0]?.data?.page_title){
  //       this.pageTitle = response.results[0].data.page_title
  //     }
  //     response.results[0]?.data?.body.forEach(prismic => {
  //       switch(prismic.slice_type){
  //           case 'seo_section':
  //             this.seoSection = prismic;
  //             break;
  //           case 'og_section':
  //           this.ogSection = prismic;
  //           break;
  //         case 'clinical_studies_inner':           

  //           if((environment.mainDomain.includes(window.location.origin) && prismic?.primary?.en_uid.toLowerCase() == studyName.toLowerCase())
  //             || prismic?.primary?.uid.toLowerCase() == studyName.toLowerCase()){
  //             console.log("inner:",prismic)
  //             this.studyDetails = prismic;
  //           }
  //             break;
  //        default:
  //            // console.log("type:",prismic)
  //       }
  //     })
  //   }).bind(this), function (err) {
  //     console.log("Something went wrong: ", err);
  //   });
  // }

  openPdf(url){
    window.open(url);
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }
}
