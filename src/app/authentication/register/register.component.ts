import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import Prismic from 'prismic-javascript';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonMethods } from 'src/app/common/common-methods';
import { prismicEnConstants } from 'src/app/common/prismic-Enconstants';
import { prismicFrConstants } from 'src/app/common/prismic-Frconstants';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonMethodsService } from 'src/app/shared/common-methods/common-methods.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  pageTitle = "";
  termsSection;
  subScription;
  footerSection;
  headerSection;
  cartCount;// = JSON.parse(localStorage.getItem('cartCount'));
  formGroup:FormGroup;
  isShowTerms = false;
  isAccountCreate = true;
  common; 
  constant: any;
  langkey: any;
  apiUrl: any;
  customerId: any;
  url: any;
  constructor(public translate: TranslateService, private formBuilder: FormBuilder,private apiService:ApiService,
    private route: ActivatedRoute, private toastr: ToastrService, public router: Router,
    public commonMtd:CommonMethodsService) {
      this.cartCount = commonMtd.getCartCountDetails();
      commonMtd.addIndexMeta();
      this.common = new CommonMethods(router);
      this.route.queryParams.subscribe(params => {
        this.customerId = params['code'];
        this.url = params['url'];
        console.log(this.url)
       
    });
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

    this.formGroup = this.formBuilder.group({    
      'first_name':[null, Validators.required],
      'last_name':[null, Validators.required],
      'email':[null,Validators.compose([Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])],
      'agree':[null,Validators.requiredTrue],
    });

    let activationCode = this.route.snapshot.queryParamMap.get('code');
    if(activationCode != null && activationCode != ''){      
      this.getCustomerDetails(activationCode);
    }    
  }

  passwordMatchValidator(control: AbstractControl) {
    const password: string = control.get('password').value;
    const cPassword: string = control.get('confPassword').value;

    if (password !== cPassword) {
      control.get('confPassword').setErrors({ NoPassswordMatch: true });
    }
  }

  get f() {
    return this.formGroup.controls;
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  submit(){
    if(this.formGroup.valid){
      this.apiService.isLoading.next(true);
      this.subScription = this.apiService.inviteActivateAccount(this.formGroup.value).subscribe((res: any) => {
        console.log('cus res', res);
        if (res.status === "7400") {
          if(this.isAccountCreate){
            if(res.message){
              this.toastr.error(res.message,this.translate.instant('error'));
            }else{
              this.toastr.success(this.translate.instant('emailForActivateAccount'),this.translate.instant('toastrSuccess'));
              this.formGroup.reset();
            }            
          }else{
            this.toastr.success(this.translate.instant('accountActivate'),this.translate.instant('toastrSuccess'));
            this.common.navigate(this.commonMtd.getRoutePath('login'));
          }
        }else
          this.toastr.error(res.message, this.translate.instant('error'));

          this.apiService.isLoading.next(false);
      }, err => {
        this.apiService.isLoading.next(false);
        this.toastr.error(this.translate.instant('serverError'), this.translate.instant('error'));
      })
    }
  }

  getPrismicDatas(){
    let ogSection: any;
    let seoSection: any;
    let twitterSection: any;
    let id = this.constant['createPage'];
    let lang = this.langkey;
    return Prismic.api(this.apiUrl).then(function (api) {
      return api.query(Prismic.Predicates.at('document.id', id),{ lang : lang});
    }).then((function (response) {
      if(response?.results[0]?.data?.page_title){
        this.pageTitle = response.results[0].data.page_title
      }
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

  getCustomerDetails(code) {
    this.apiService.isLoading.next(true);
    this.subScription = this.apiService.getCustomerDetails(code).subscribe((res: any) => {
      console.log('cus res', res);
      if (res.status === "7400") {
        if (res.value == "0") {
          this.toastr.error(this.translate.instant('noActiveAccount'), this.translate.instant('error'));
        } else {
          this.isAccountCreate = false;
          this.formGroup = this.formBuilder.group({
            'first_name': [null, Validators.required],
            'last_name': [null, Validators.required],
            'email': [null, Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])],
            'password': [null, Validators.compose([Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')])],
            'confPassword': [null, Validators.required],
            'agree': [null, Validators.requiredTrue],
            'id': [null]
          }, {
            validator: this.passwordMatchValidator
          });

          this.formGroup.patchValue(res.value);
        }
      } else {
        this.toastr.error(res.message, this.translate.instant('error'));
      }
      this.apiService.isLoading.next(false);
    }, err => {
      this.apiService.isLoading.next(false);
    })
  }

  mmTerms(){
    localStorage.setItem("termPage", 'true');
    this.commonMtd.navigate(this.commonMtd.getRoutePath('termscon'));
  }

}
