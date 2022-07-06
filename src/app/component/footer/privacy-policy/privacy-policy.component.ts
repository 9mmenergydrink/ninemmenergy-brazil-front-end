import { Component, OnInit } from '@angular/core';
import Prismic from 'prismic-javascript';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { prismicEnConstants } from 'src/app/common/prismic-Enconstants';
import { prismicFrConstants } from 'src/app/common/prismic-Frconstants';
import { CommonMethodsService } from 'src/app/shared/common-methods/common-methods.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {

  headerSection: any;
  footerSection: any;
  contentSection;
  cartCount;// = JSON.parse(localStorage.getItem('cartCount'));
  constant: any;
  langkey: any;
  apiUrl: any;
  constructor(private commonMtd:CommonMethodsService) {
    this.cartCount = commonMtd.getCartCountDetails();
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
  }


  getPrismicDatas() {
    let ogSection: any;
    let seoSection: any;
    let twitterSection: any;
    let lContentSection;
    let id = this.constant['privacyid']
    let lang = this.langkey
    return Prismic.api(this.apiUrl).then(function (api) {
      return api.query(Prismic.Predicates.at('document.id', id),{ lang : lang});
    }).then((function (response) {

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
            console.log("twitter_section:", prismic);           
            twitterSection = prismic;
             break;
          case 'content_section':
            lContentSection = prismic;
            break;
          default:
            console.log("privacy:", prismic)
        }       
        
      })

      this.commonMtd.addMetaTag(seoSection, ogSection, twitterSection);

        let tContent = [];
        let lIndex;
        lContentSection?.primary?.contents?.forEach((item,index) => {
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
             item.text = item.text.replace(/\n/g, "<br> &nbsp;&nbsp;&nbsp;");
           }
           
          }
        }

        if(item.text.includes('\n') && !item.isInnerHtml){
          item.isInnerHtml = true;
          item.text = item.text.replace(/\n/g, "<br> &nbsp;&nbsp;&nbsp;");
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
        this.contentSection = tContent;
      /////

      

    }).bind(this), function (err) {
      console.log("Something went wrong: ", err);
    });
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

}
