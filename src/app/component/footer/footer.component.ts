import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Prismic from 'prismic-javascript';
import { prismicEnConstants } from 'src/app/common/prismic-Enconstants';
import { prismicFrConstants } from 'src/app/common/prismic-Frconstants';
import { CommonMethodsService } from 'src/app/shared/common-methods/common-methods.service';
import { PopupFormComponent } from 'src/app/shared/popup/popup-form/popup-form.component';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  currYear= new Date().getFullYear();
  menu;
  logoSection;
  socialLinkSection;
  menuSection;
  contactSection;
  constant: any;
  langkey: any;
  apiUrl: any;
  @Input() set footerSection(val:any){
  //   if (val != null) 
  //   {
  //   this.footer = val;
  //   console.log("val",val)
  // }
  // else{
  //   this.footer = JSON.parse(localStorage.getItem('footer'));
  //   if(this.footer==null || this.footer ==''){
  //     this.getHeaderFooterDatas();
  //   }
  // }
  }
  header:any;
  @Input() set headerSection(val:any){
    this.menu = localStorage.getItem('menu');
  /*  if (val != null) 
    {
    this.header = val;
  }
  else{
    this.header = JSON.parse(localStorage.getItem('header'));
    if(this.header==null || this.header ==''){
      this.getHeaderFooterDatas();
    }
  }*/
  }
  constructor(public router: Router, public commonMtd: CommonMethodsService, private modalService: NgbModal) {
    
   }

  ngOnInit(): void {
    let domainLanguage = this.commonMtd.getSubDomainLanguage();
    this.constant = domainLanguage.constant;
    this.langkey = domainLanguage.langkey;
    this.apiUrl = domainLanguage.apiUrl;

    this.getFooterDatas();
  }

  onClick(menuname, isNavigate?){

    menuname = menuname.replace(/ /g, "");
    menuname = menuname.toLowerCase();
    this.menu = menuname;
    localStorage.setItem('menu', menuname);
    let name = "/";
   /* if (menuname != '' && menuname.includes('/')) {
      name = menuname;
    }else{
      name = prismicEnConstants[menuname] == null? '/': prismicEnConstants[menuname]
    }*/

    name = this.commonMtd.getRoutePath(menuname, localStorage.getItem('language'));

    if( isNavigate || this.router.url != name){
      this.router.navigate([name])
      .then(() => {
    //    window.location.reload();
      });
    }
  }

  onClickSocial(url){
    window.open(url);
  }

  getFooterDatas(){
    let id = this.constant['footerId'];
    let lang = this.langkey
    return Prismic.api(this.apiUrl).then(function (api) {
     // return api.query(Prismic.Predicates.at('document.id', 'YJ5rahEAAGb8SCfY'));
     return api.query(Prismic.Predicates.at('document.id', id),{ lang : lang});
    }).then((function (response) {
      
      response.results[0]?.data?.body.forEach(prismic => {
        switch(prismic.slice_type){
          case 'logo_section':
            this.logoSection = prismic;
            break;
          case 'social_link_section':
            console.log("socialLinkSection:",prismic)
            this.socialLinkSection = prismic;
            break;
          case 'menu_section':
            this.menuSection = prismic;
            break;
          case 'contact_section':            
            this.contactSection = prismic;
            break;
            default:
              // console.log("footer type:",prismic)
        }
      })
    }).bind(this), function (err) {
      console.log("Something went wrong: ", err);
    });
  }

  openCtaPopup(CTAscript?, customCss?) {
    if (!customCss) {
      customCss = "bookAppointmentCustomClass";
    }
    var script = CTAscript;
    const modalRef = this.modalService.open(PopupFormComponent, { centered: true, windowClass: customCss });
    modalRef.componentInstance.script = '<iframe frameborder="0" style="height:700px;width:99%;border:none;" src="https://forms.zohopublic.com/9mmbeyondenergy/form/WhatsOnYourMind4/formperma/LNQIafKpr8s4f1Hdrx9dIwnW1agfEilU235Fw-4-hy0"></iframe>'//script;
  }
}
