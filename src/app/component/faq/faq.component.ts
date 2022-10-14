import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Prismic from 'prismic-javascript';
import { CommonMethods } from 'src/app/common/common-methods';
import { CommonMethodsService } from 'src/app/shared/common-methods/common-methods.service';
import { PopupFormComponent } from 'src/app/shared/popup/popup-form/popup-form.component';
import { environment } from 'src/environments/environment';
declare let $: any;


@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  pageTitle = "";
  headerSection: any;
  footerSection: any;
  bannerSection: any;
  enquirySection;
  contentSection;
  callToAction: any;
  common: CommonMethods;
  faqTitle;

  cartCount;// = JSON.parse(localStorage.getItem('cartCount'));

  constructor(private router: Router, private commonMtd: CommonMethodsService,private modalService: NgbModal,
    private _renderer2: Renderer2, @Inject(DOCUMENT) private _document: Document) {
    this.cartCount = commonMtd.getCartCountDetails();
    this.common = new CommonMethods(router);
    commonMtd.addIndexMeta(true, false);
  }

  ngOnInit(): void {    
    this.getPrismicDatas();
    this.common.clear();
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  gotoReadMore() {
    // this.common.navigate('/read-more', "brain-workout");
    this.router.navigate(['/shop'], { fragment: 'down' });
  }

  getPrismicDatas() {
    let ogSection: any;
    let seoSection: any;
    let twitterSection: any;
    let lContentSection;
    let domainLanguage = this.commonMtd.getSubDomainLanguage();
    let id = domainLanguage.constant['faqId'];
    return Prismic.api(domainLanguage.apiUrl).then(function (api) {
      return api.query(Prismic.Predicates.at('document.id', id), { lang: domainLanguage.langkey });
    }).then((function (response) {
      if (response?.results[0]?.data?.page_title) {
        this.pageTitle = response.results[0].data.page_title
      }
      response.results[0]?.data?.body.forEach(prismic => {
        switch (prismic.slice_type) {
          case 'seo_section':
            console.log("seosection:", prismic);
            seoSection = prismic;
            break;
          case 'og_section':
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
          case 'content_section':
            console.log("contentSection", prismic);
            this.faqTitle = prismic?.primary?.title;
            console.log('FAQ TITLE: ' ,this.faqTitle);
            lContentSection = prismic;
            break;
          case 'enquiry_section':
            this.enquirySection = prismic;
            break;

          default:
            console.log("faq:", prismic)
        }
      })
      this.commonMtd.addMetaTag(seoSection, ogSection, twitterSection);

      let tContent = [];
      let lIndex, oIndex;
      lContentSection?.primary?.contents?.forEach((item, index) => {
        let txt = "";
        let prev = 0;
        if (!item.type.includes("heading")) {
          item.isInnerHtml = false;

          for (let s of item.spans) {
            if (s.type == "strong") {
              item.isInnerHtml = true;
              txt += '<span>' + item.text.substring(prev, s.start);
              txt += "<b>" + item.text.substring(s.start, s.end) + "</b>";
              prev = s.end;
            } else if (s.type == "hyperlink") {
              item.isInnerHtml = true;
              txt += '<span>' + item.text.substring(prev, s.start);
              txt += '<a class="blog-link" href="' + s.data.url + '" target="_blank">' + item.text.substring(s.start, s.end) + "</a>";
              prev = s.end;
            }
          }
          if (item.isInnerHtml) {
            txt += item.text.substring(prev, item.text.length) + '</span>';
            item.text = txt;
            if (item.text.includes('\n')) {
              item.text = item.text.replace(/\n/g, "<br> &nbsp;&nbsp;&nbsp;");
            }

          }
        }

        if (item.text.includes('\n') && !item.isInnerHtml) {
          item.isInnerHtml = true;
          item.text = item.text.replace(/\n/g, "<br> &nbsp;&nbsp;&nbsp;");
          item.text = '<span>' + item.text + '</span>';
        }

        // 



        if (oIndex == null && (item.type.includes("heading1") || item.type.includes("heading2"))) {
          tContent.push(item);
        } else if (item.type.includes("heading3")) {
          lIndex = null;
          if (oIndex == null) {
            item.show = true;
          } else {
            item.show = false;
          }
          oIndex = tContent.length;

          item.datas = [];
          tContent.push(item);
        } else {
          if (item.type == "list-item" || item.type == "o-list-item") {
            if (!lIndex) {
              lIndex = tContent.length;
              item.list = [];
              item.list.push(item);
              tContent[oIndex].datas.push(item);
              // tContent[oIndex].obj.list.push({type:item.type, datas:[item.text]})
            } else {
              tContent[oIndex].datas[lIndex].list.push(item);
            }
          } else {
            tContent[oIndex].datas.push(item);
            lIndex = null;
          }
        }
      })
      this.contentSection = tContent;
     // this.addSchemaScript();
      console.log("contSect: ", this.contentSection);

    }).bind(this), function (err) {
      console.log("Something went wrong: ", err);
    });
  }
  activeIds: string[] = [];
  panels = [0, 1, 2, 3]

  openAll() {
    this.activeIds = this.panels.map(p => "panel-" + p);
    console.log(this.activeIds);
  }

  openDetail(item) {
    item.show = !item.show;
  }

  addSchemaScript(){
		/*schema script*/ 
		let origin = environment.mainDomain;
		let mainUrl = window.location.href;
		if(origin == mainUrl){
		  let organisationSchema = this._renderer2.createElement('script');
		  organisationSchema.type = `application/ld+json`;
		  organisationSchema.text = `
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How do I add a question?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Just click on the \"Add a Question\" button at the end of the current questions."
            }
          }
      ]
      }
		  `;
		  this._renderer2.appendChild(this._document.head, organisationSchema);	  
		}
		/*schema script*/ 
	  }

    openPopupForm(formScript) {
      if(formScript){
        const modalRef = this.modalService.open(PopupFormComponent, {windowClass: "zohoPopupFormCustomCss"});
        modalRef.componentInstance.script = formScript;
      }
    }

    ngOnDestroy() {
      this.modalService.dismissAll();
    }
}
