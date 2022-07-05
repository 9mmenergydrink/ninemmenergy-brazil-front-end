import { Component, OnInit, Renderer2, Inject, HostListener } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Prismic from 'prismic-javascript';
import { Subscription } from 'rxjs';
import { CommonMethods } from 'src/app/common/common-methods';
import { prismicEnConstants } from 'src/app/common/prismic-Enconstants';
import { prismicFrConstants } from 'src/app/common/prismic-Frconstants';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContactEmailComponent } from 'src/app/shared/contact-email/contact-email.component';
import { CommonMethodsService } from 'src/app/shared/common-methods/common-methods.service';
import { TranslateService } from '@ngx-translate/core';
import { PopupFormComponent } from 'src/app/shared/popup/popup-form/popup-form.component';
declare let $: any;

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  pageTitle = "";
  headerSection: any;
  footerSection: any;
  cartCount;// = JSON.parse(localStorage.getItem('cartCount'));
  bannerSection;
  contactSection;
  messageSection;
  memberSection;
  constant: any;
  langkey: any;
  apiUrl: any;
  common: CommonMethods;
  conForm: FormGroup;
  submitted = false;
  subScription: Subscription;
  constructor(public translate: TranslateService, private renderer2: Renderer2, @Inject(DOCUMENT) private apiService: ApiService, private formBuilder: FormBuilder, private toastr: ToastrService,
    private router: Router, private modalService: NgbModal, private commonMtd: CommonMethodsService) {
    this.cartCount = commonMtd.getCartCountDetails();
    commonMtd.addIndexMeta();
    this.common = new CommonMethods(router);
  }

  ngOnInit(): void {
    // if (localStorage.getItem('language') == 'fr') {
    //   this.constant = prismicFrConstants
    //   this.langkey = 'fr-fr'
    // } else {
    //   this.constant = prismicEnConstants
    //   this.langkey = 'en-us'
    // }

    let domainLanguage = this.commonMtd.getSubDomainLanguage();
    this.constant = domainLanguage.constant;
    this.langkey = domainLanguage.langkey;
    this.apiUrl = domainLanguage.apiUrl;

    this.getPrismicDatas();
    this.common.clear();

    this.conForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      phone: ['', Validators.compose([Validators.required, Validators.pattern('^[- +()0-9]*$')])],
      message: ['', Validators.required],

      choice: new FormGroup({
        Wolesaler: new FormControl(false, Validators.required),
        Retailer: new FormControl(false, Validators.required),
        Customer: new FormControl(false, Validators.required),
        Influencer: new FormControl(false, Validators.required),
        Other: new FormControl(false, Validators.required),
      }),

      /* 'wolesaler':[false,Validators.required],
       'retailer':[false,Validators.required],
       'customer':[false,Validators.required],
       'influencer':[false,Validators.required],
       'other':[false,Validators.required],*/
      link: [environment.contactUrl]
    })
    // const s = this.renderer2.createElement('script');
    // s.type = 'text/javascript';
    // s.async = true;
    // s.src = 'https://app.ontraport.com/js/ontraport/opt_assets/drivers/opf.js';
    // s.setAttribute("data-opf-uid", 'p2c236348f15' );
    // s.setAttribute("data-opf-params", "borderColor=#ffffff&borderSize=5px&embed=true&formHeight=387&formWidth=60%&popPosition=mc&instance=162597297");
    // var div = document.getElementById("ontrapoet");
    // this.renderer2.appendChild(div, s);
    // setTimeout(() => {
    //   document.getElementsByClassName("button-style");
    // }, 1000);
  }

  get c() {
    return this.conForm.controls;
  }

  contactSubmit() {
    this.submitted = true;

    if (!this.conForm.value.choice.Wolesaler && !this.conForm.value.choice.Retailer
      && !this.conForm.value.choice.Customer && !this.conForm.value.choice.Influencer
      && !this.conForm.value.choice.Other) {
      this.conForm.get('choice').setErrors({ errors: true });
    }

    if (!this.conForm.valid) {
      return this.toastr.error(this.translate.instant('validInfo'));
    } else {
      this.apiService.isLoading.next(true);
      console.log("contact form", this.conForm.value);
      this.subScription = this.apiService.getIP().subscribe((res: any) => {
        this.conForm.value.ip = res.ip;
        this.conForm.value.date = new Date();
        this.conForm.value.phone = this.conForm.value.phone.replace(/-/g, "");
        this.conForm.value.name = this.conForm.value.firstName;
        if (this.conForm.value.lastName) {
          this.conForm.value.name += ' ' + this.conForm.value.lastName;
        }

        let choice = this.conForm.value.choice;

        this.conForm.value.choice = Object.keys(choice).filter(function (key) { return choice[key] });

        this.subScription = this.apiService.sendFeedback(this.conForm.value).subscribe((res: any) => {
          console.log("res sendfeedback", res);
          this.submitted = false;
          this.conForm.reset();
          this.toastr.success(this.translate.instant('contactSaved'), this.translate.instant('toastrSuccess'));
          this.apiService.isLoading.next(false);
        }, err => {
          this.apiService.isLoading.next(false);
        })

      }, err => {
        this.apiService.isLoading.next(false);
      })
    }

  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  gotoReadMore() {
    // this.common.navigate('/read-more', "contact");
    this.router.navigate([this.commonMtd.getRoutePath('shop')], { fragment: 'down' });
  }

  getPrismicDatas() {
    let ogSection: any;
    let seoSection: any;
    let twitterSection: any;
    let id = this.constant['contactId'];
    let lang = this.langkey;
    return Prismic.api(this.apiUrl).then(function (api) {
      return api.query(Prismic.Predicates.at('document.id', id), { lang: lang });
    }).then((function (response) {
      if (response?.results[0]?.data?.page_title) {
        this.pageTitle = response.results[0].data.page_title
      }
      response.results[0]?.data?.body.forEach(prismic => {
        switch (prismic.slice_type) {
          case 'seosection':
            seoSection = prismic;
            break;
          case 'ogsection':
            ogSection = prismic;
            break;
          case 'twitter_section':
            twitterSection = prismic;
            break;
          case 'bannersection':
          case 'banner_section':
            this.bannerSection = prismic;
            break;
          case 'contactsection':
            console.log("contactsection:", prismic)
            this.contactSection = prismic;
            break;
          case 'member_section':
            console.log("memberSection:", prismic)
            this.memberSection = prismic;
            break;
          case 'messagesection':
            console.log("prismic:", prismic)
            this.messageSection = prismic;
            break;
          default:
            console.log("type:", prismic)
        }
      })
      this.commonMtd.addMetaTag(seoSection, ogSection, twitterSection);
      //this.messageScript();
      var contactFormScript = '<iframe frameborder="0" style="height:520px;width:99%;border:none;" src="https://forms.zohopublic.com/9mmbeyondenergy/form/9MMBEYONDENERGY/formperma/QIFfVz-Y8JHC2f-EIYLgb0aHRJboRUG2SX0tSmSFq1M"></iframe>'//this.messageSection?.primary?.contact_form_script;
      $("#zohoContactFormId").append(contactFormScript);
    }).bind(this), function (err) {
      console.log("Something went wrong: ", err);
    });
  }

  messageScript() {
    this.contactSection?.items.forEach((element, index) => {
      $("#hq" + index).append(element.popup_form_script);
      var hq_opf_uid = $("#hq" + index + " script").attr("data-opf-uid");
      $("#hq" + index).attr("data-opf-trigger", hq_opf_uid);
    });

    this.desktopMobile();

    this.memberSection?.items.forEach((element, index) => {
      $("#press" + index).append(element.popup_form_script);
      var press_opf_uid = $("#press" + index + " script").attr("data-opf-uid");
      $("#press" + index).attr("data-opf-trigger", press_opf_uid);
    });
  }

  desktopMobile() {
    // var isAndroid = navigator.userAgent.match(/Android/i);
    // var isIOS = navigator.userAgent.match(/iPhone|iPad|iPod/i);
    var isMobile = navigator.userAgent.match(/Mobile|Android|iPhone|iPod/i);
    var isIpad = navigator.userAgent.match(/iPad/i);
    if (isMobile && (isIpad == null)) {
      var message_script = this.messageSection?.primary?.mobile_script;
    } else {
      var message_script = this.messageSection?.primary?.desktop_script;
    }
    $("#ontrapoet").append(message_script);
  }

  @HostListener('window:resize', [])
  onResize(): void {
    this.desktopMobile();
  }
  // open(contactPopup) {
  //   this.modalService.open(contactPopup, { centered: true, windowClass: 'subs-popup'});
  // }
  open() {
    // const modalRef = this.modalService.open(ContactEmailComponent, { size: 'md',centered: true,windowClass: 'contact-popup'});
    //  modalRef.componentInstance.setVideoUrl = contactPopup;
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
