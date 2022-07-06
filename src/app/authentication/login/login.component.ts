import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import Prismic from 'prismic-javascript';
import { CommonMethods } from 'src/app/common/common-methods';
import { ApiService } from 'src/app/services/api.service';
import { CommonMethodsService } from 'src/app/shared/common-methods/common-methods.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  prismicData;
  footerSection;
  headerSection;
  cartCount;// = JSON.parse(localStorage.getItem('cartCount'));
  formGroup: FormGroup;
  common: CommonMethods;
  constant: any;
  langkey: any;
  apiUrl: any;
  constructor(public translate: TranslateService, private service: ApiService, private router: Router, private toastr: ToastrService,
    public commonMtd: CommonMethodsService) {
    this.cartCount = commonMtd.getCartCountDetails();
    commonMtd.addIndexMeta();
    this.common = new CommonMethods(router);
    let domainLanguage = this.commonMtd.getSubDomainLanguage();
    this.constant = domainLanguage.constant;
    this.langkey = domainLanguage.langkey;
    this.apiUrl = domainLanguage.apiUrl;
  }

  ngOnInit(): void {
    this.getPrismicDatas();
    localStorage.setItem('menu', 'Login');
    this.formGroup = new FormGroup({
      'email': new FormControl(null, Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])),
      'password': new FormControl(null, [Validators.required])
    });
    
  }

  get f() {
    return this.formGroup.controls;
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }
  getPrismicDatas() {
    let ogSection: any;
    let seoSection: any;
    let twitterSection: any;
    let id = this.constant['loginId'];
    let lang = this.langkey;
    return Prismic.api(this.apiUrl).then(function (api) {
      return api.query(Prismic.Predicates.at('document.id', id),{ lang : lang});
    }).then((function (response) {
        this.prismicData = response?.results[0]?.data
        console.log("this.prismicData ", this.prismicData )
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
          default:
            console.log("type:", prismic)
        }
      })
      this.commonMtd.addMetaTag(seoSection, ogSection, twitterSection);
    }).bind(this), function (err) {
      console.log("Something went wrong: ", err);
    });
  }
  submit() {
    this.service.isLoading.next(true);
    localStorage.setItem('showUserMenu', 'false');
    this.service.customerLogin(this.formGroup.value).subscribe((res: any) => {
      if (res?.status === "7400" && res?.value?.accessToken)
    {
        localStorage.setItem('showUserMenu', 'true');
        localStorage.setItem('email', this.formGroup.value.email);
        localStorage.setItem('uToken', res?.value?.accessToken);

        this.commonMtd.checkOrderStatus(this.commonMtd.getCurrentCartDetails(), this.formGroup.value.email);
        this.common.navigate(this.commonMtd.getRoutePath('myaccount'));
      }else{
        this.toastr.error(this.translate.instant('loginFailed'), this.translate.instant('error'));
      }
      this.service.isLoading.next(false);
    }, err => {
      this.service.isLoading.next(false);
    })
  }

}
