import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import Prismic from 'prismic-javascript';
import { Subscription } from 'rxjs';
import { CommonMethods } from 'src/app/common/common-methods';
import { ApiService } from 'src/app/services/api.service';
import { CommonMethodsService } from 'src/app/shared/common-methods/common-methods.service';

@Component({
  selector: 'app-forgot-pwd',
  templateUrl: './forgot-pwd.component.html',
  styleUrls: ['./forgot-pwd.component.css']
})
export class ForgotPwdComponent implements OnInit {
  btnName = "send";
  title1 = "forgotPassword";
  title2 = "enterEmailAddressBelow";
  footerSection;
  headerSection;
  cartCount;// = JSON.parse(localStorage.getItem('cartCount'));
  formGroup: FormGroup;
  prismicData;
  v = 0;
  customerId: number;
  url: string;
  token: string;
  private subScription: Subscription;
  common: CommonMethods;
  constant: any;
  langkey: any;
  apiUrl: any;

  constructor(public translate: TranslateService, private formBuilder: FormBuilder, private service: ApiService, private route: ActivatedRoute,
    private toastr: ToastrService, private router: Router, private commonMtd:CommonMethodsService) {
      this.cartCount = commonMtd.getCartCountDetails();
      commonMtd.addIndexMeta();
    this.route.queryParams.subscribe(params => {
      if (params['url']) {
        this.customerId = params['code']?parseInt(params['code']):0;
        this.url = params['url'];
        let data = this.url?.split('/');
        this.token = data[6];

        console.log(data, this.token);
        if (this.customerId)
          this.v = 2
      }
      this.common = new CommonMethods(router);
    });
  }

  ngOnInit(): void {
    let domainLanguage = this.commonMtd.getSubDomainLanguage();
    this.constant = domainLanguage.constant;
    this.langkey = domainLanguage.langkey;
    this.apiUrl = domainLanguage.apiUrl;
    this.getPrismicDatas();
    localStorage.setItem('menu', 'Login');

    if (this.v == 1) {
      this.btnName = 'logIn';
      this.title2 = "yourPasswordUpdate";
      this.title1 = "passwordUpdate";
    } else if (this.v == 2) {
      this.title2 = "enterNewPassword";
      this.btnName = "update";
      this.formGroup = this.formBuilder.group({
        //'email': [null, Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])],
        'password': [null, Validators.compose([Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')])],
        'confPassword': [null, Validators.required],
      }, {
        validator: this.passwordMatchValidator
      });
    } else {
      this.formGroup = new FormGroup({
        'email': new FormControl(null, Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])),
      });
    }


  }
  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  passwordMatchValidator(control: AbstractControl) {
    const password: string = control.get('password').value;
    const cPassword: string = control.get('confPassword').value;

    if (password !== cPassword) {
      control.get('confPassword').setErrors({ NoPassswordMatch: true });
    }else{
      control.get('confPassword').setErrors(null);
    }
  }
  
  get f() {
    return this.formGroup.controls;
  }
  getPrismicDatas(){
    let ogSection: any;
    let seoSection: any;
    let twitterSection: any;
    let id = this.constant['forgotPage'];
    let lang = this.langkey;
    return Prismic.api(this.apiUrl).then(function (api) {
      return api.query(Prismic.Predicates.at('document.id', id),{ lang : lang});
    }).then((function (response) {
      this.prismicData = response?.results[0]?.data;
      response.results[0]?.data?.body.forEach(prismic => {
        switch(prismic.slice_type){
          case 'seo_section':
            seoSection = prismic;
            break;
          case 'ogsection':
            ogSection = prismic;
            break;
          case 'twitter_section':          
            twitterSection = prismic;
            break;
          case 'terms_conditionssection':
            this.termsSection = prismic;
            break;         
          default:
            console.log("type:",prismic)
        }
      })
      this.commonMtd.addMetaTag(seoSection, ogSection, twitterSection);
    }).bind(this), function (err) {
      console.log("Something went wrong: ", err);
    });
  }

  submit() {
    if (this.formGroup.valid) {
      if (!this.formGroup.value.password) {
        let obj = {
          email: this.formGroup.value.email,
        };
        console.log()
        this.service.customerRecover(obj).subscribe((res: any) => {
         
          if (res?.value?.customerRecover?.customerUserErrors?.length == 0)
          this.toastr.success(this.translate.instant('resetPassword'));
          else {
            this.toastr.error(this.translate.instant('somethingWrong'));
          }
        })
      }
      else {
        /*  this.service.customerReset(this.customerId,this.token,this.formGroup.value.password).then(({ model, data }) => {
          console.log(model, data)
        })   */
        let obj = {
          id: this.customerId,
          password: this.formGroup.value.password
        }
        this.subScription = this.service.updateAccount(obj).subscribe((res: any) => {
          console.log(res);
          if (res.status === "7400") {
            this.toastr.success(this.translate.instant('passwordUpdated'), this.translate.instant('toastrSuccess'));
            this.common.navigate(this.commonMtd.getRoutePath('login'));
          }
          else
            this.toastr.error(res.message, this.translate.instant('error'));
        }, err => {

        })
      }
    }
    else
      console.log('not valid data');
  }

}
