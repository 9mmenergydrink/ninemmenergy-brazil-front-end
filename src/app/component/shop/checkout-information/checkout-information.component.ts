import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { CommonMethods } from 'src/app/common/common-methods';
import Prismic from 'prismic-javascript';
import { ApiService } from 'src/app/services/api.service';
import {TranslateService} from '@ngx-translate/core';
import { prismicEnConstants } from 'src/app/common/prismic-Enconstants';
import { prismicFrConstants } from 'src/app/common/prismic-Frconstants';
import { CommonMethodsService } from 'src/app/shared/common-methods/common-methods.service';
let self;
@Component({
  selector: 'app-checkout-information',
  templateUrl: './checkout-information.component.html',
  styleUrls: ['./checkout-information.component.css']
})
export class CheckoutInformationComponent implements OnInit {
  pageTitle = "";
  pcode;
  @ViewChild('email') emailElement: ElementRef;
  @ViewChild('address') addressElement: ElementRef;
  @ViewChild('stateSelect') stateSelectElement: ElementRef;
  @ViewChild('countrySelect') countrySelectElement: ElementRef;
  cartDetails = [];
  cartCount: any = {};
  shipping = 20.00;
  total;
  formGroup: FormGroup;
  phoneForm: FormGroup;
  subScription;
  countryList = [];
  stateList = [];
  state;
  country;
  info;
  common;

  isMobile = null;
  mobNo;
  prevCode = "";

  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  constant: any;
  langkey: any;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  profile;

  constructor(private apiService: ApiService, public router: Router, public translate: TranslateService,
    private commonMtd: CommonMethodsService) {
    commonMtd.addIndexMeta();
    this.common = new CommonMethods(router);  translate.use(localStorage.getItem('language'));
    self = this;
  }

  ngOnInit(): void {
    if(localStorage.getItem('language') == 'fr'){
      this.constant = prismicFrConstants
      this.langkey = 'fr-fr'
    }else{
      this.constant = prismicEnConstants
      this.langkey = 'en-us'
    }
    this.getPrismicDatas();

    let currPrd = JSON.parse(localStorage.getItem('currPrd'));
    if (currPrd != null) {
      this.cartDetails.push(currPrd);
      this.cartCount.subTotal = currPrd.total;
    } else {
      this.cartDetails = JSON.parse(localStorage.getItem('cartDetails'));
      this.cartCount = JSON.parse(localStorage.getItem('cartCount'));
    }
    this.total = (parseFloat(this.cartCount?.subTotal) + this.shipping).toFixed(2);

    this.phoneForm = new FormGroup({
      'phone': new FormControl(null, Validators.compose([Validators.required]))
    });
    this.phoneForm.controls.phone.setValue('9898989898');

      this.formGroup = new FormGroup({
        'first_name': new FormControl(null, [Validators.required]),
        'last_name': new FormControl(null, [Validators.required]),
        'address1': new FormControl(null, [Validators.required]),
        'address2': new FormControl(null),
        'city': new FormControl(null, [Validators.required]),
        'email': new FormControl(null, Validators.compose([Validators.required, this.validateMobEmail.bind(this)])),
        'country': new FormControl(null, [Validators.required]),
        'province': new FormControl(null, [Validators.required]),
        'zip': new FormControl(null, Validators.compose([Validators.required, this.validateZipCode.bind(this)])),
        'accepts_marketing': new FormControl(false),
        'isSaveInfo': new FormControl(false),
        'address' : new FormControl(null),
        'phone': new FormControl(null)
      });
    
    this.profile = JSON.parse(localStorage.getItem("profile"));
    if(this.profile?.addresses?.length){
      if(this.profile.addresses[this.profile.addresses.length-1]?.name != 'Use a new address')
      this.profile.addresses.push({name:'Use a new address'});
      let address = this.profile.addresses[0];

      this.formGroup.patchValue(address);
      this.formGroup.get("accepts_marketing").setValue(this.profile.accepts_marketing);
      this.formGroup.get("address").setValue(address);
      this.formGroup.get("email").setValue(this.profile.email);
    }
    

    if (localStorage.getItem("change") != null) {
      if (localStorage.getItem("change") == 'address') {
        setTimeout(() => { // this will make the execution after the above boolean has changed
          this.addressElement.nativeElement.focus();
        }, 0);
        // (<any> this.formGroup.get('address')).nativeElement.focus();
        this.info = JSON.parse(localStorage.getItem('info'));
      } else if (localStorage.getItem("change") == 'contact') {
        setTimeout(() => {
          this.emailElement.nativeElement.focus();
        }, 0);
        this.info = JSON.parse(localStorage.getItem('info'));
      }
    }

    this.getCountries();
    this.common.clear();
  }

  ngAfterViewInit() {
    //To set placeholders for Country and State --start here
        let getStateElement = this.stateSelectElement.nativeElement as HTMLSelectElement;
        let stateOptionValue = getStateElement.selectedIndex;
        let getCountryElement = this.countrySelectElement.nativeElement as HTMLSelectElement;
        let countryOptionValue = getCountryElement.selectedIndex;
        if(stateOptionValue == -1 && countryOptionValue == 0){
          this.stateSelectElement.nativeElement.classList.add("dd-placeholder");
          this.countrySelectElement.nativeElement.classList.add("dd-placeholder");
        }
    //To set placeholders for Country and State --end here
  }

  get f() {
    return this.formGroup.controls;
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  onClickLogin(){
   // localStorage.setItem('isCheckout', );
    this.router.navigate(['/login']);
  }

  onClickLogOut(){ 
    this.common.clearAccountInformation();
    this.profile=null;
    this.formGroup.reset();
  }

  onChangeAddress(){
    let address = this.formGroup.value.address;
    this.formGroup.reset();
    if(address.address1){
      this.formGroup.patchValue(address);
      this.country = this.countryList.find(item=>item.shortName==address.country_code);
      this.formGroup.get('country').setValue(this.country);
    }else{
      this.formGroup.get('address').setValue(address);
      this.formGroup.get('email').setValue(this.profile.email);
      this.formGroup.get("accepts_marketing").setValue(this.profile.accepts_marketing);

      //To set placeholders for Country and State --start here
      this.stateSelectElement.nativeElement.classList.add("dd-placeholder");
      this.countrySelectElement.nativeElement.classList.add("dd-placeholder");
      //To set placeholders for Country and State --end here
    }
    
  }

  validateZipCode(controls) {
    if (controls.value != null && controls.value != "" && self.formGroup) {
      if (self.formGroup.value.country == null || self.formGroup.value.country.shortName == null) {
        return { 'countryEmpty': true };
      } else if (self.formGroup.value.province == null || self.formGroup.value.province == '') {
        return { 'stateEmpty': true };
      } else {
        self.apiService.getZipCodeDetail(self.formGroup.value.country.shortName, controls.value).subscribe((res: any) => {
          console.log('res:', res);
          let found = false;
          res?.result?.forEach(data => {
            if (data.state == self.formGroup.value.province) {
              found = true;
              this.formGroup.get('zip').errors.invalidCode = false;
              this.formGroup.get('zip').setErrors(null);
              return { 'invalidCode': false };
            }
          })
          if (found) {
            this.formGroup.get('zip').errors.invalidCode = false;
            this.formGroup.get('zip').setErrors(null);
            return { 'invalidCode': false };
          } else {
            this.formGroup.get('zip').errors.invalidCode = true;
            return { 'invalidCode': true };
          }
        }, err => {
          console.log('error:', err);
          this.formGroup.get('zip').errors.invalidCode = true;
          return { 'invalidCode': true };
        })
        return { 'invalidCode': true };
      }
    } else {
      return { 'invalidCode': false };
    }
  }
  /* validateMob(controls:AbstractControl){
     if(this.isMobile){    
       if(this.phoneForm.errors){
         if(this.formGroup.get('email').errors?.invalidEmail)
         this.formGroup.get('email').errors.invalidEmail = false;
         return controls.errors;
       }else{
         this.formGroup.get('email').setErrors(null);
         return null;
       }
     }
   }*/

  validateMobEmail(controls: AbstractControl) {
    this.isMobile = null;
    if (controls.value != null && controls.value != "") {
      if (isNaN(controls.value)) {
        this.isMobile = false;
        this.formGroup.get('phone').setValidators(Validators.compose([Validators.required,Validators.pattern('^[- +()0-9]*$')]));
        const regExp = new RegExp("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$");
        if (regExp.test(controls.value) || controls.value == "") {
          return null; //valid
        } else {
          if (this.formGroup.get('email').errors?.invalidPhone)
            this.formGroup.get('email').errors.invalidPhone = false;
          return { 'invalidEmail': true };
        }
      } else {
        this.formGroup.get('phone').clearValidators();
        this.isMobile = true;
        if (!this.phoneForm.valid) {
          if (this.formGroup.get('email').errors?.invalidEmail)
            this.formGroup.get('email').errors.invalidEmail = false;
          return { 'invalidPhone': true };
        } else {
          return null;
        }

      }
    }

  }

  onChangeMobile(event) {
    this.mobNo = event.currentTarget.value;
    if (this.mobNo != null && this.mobNo != '' && !isNaN(this.formGroup.value.email)) {
      this.formGroup.controls['email'].setValue(this.getMobileCode(this.phoneForm.value.phone.dialCode));
    }
  }

  getMobileCode(code) {
    let temp = this.mobNo.replace(this.prevCode, '');
    this.phoneForm.controls.phone.setValue(temp);
    this.prevCode = code;
    return code + temp;
  }

  changeSelectedCountryCode(event) {
    this.formGroup.controls['email'].setValue(this.getMobileCode("+" + event.dialCode));
  }

  onChangeCountry() {
    this.info = null;
    this.formGroup.get('zip').errors.countryEmpty = null;
    this.getStates(this.formGroup.value.country.shortName);

    //To set placeholders for Country --start here
      let getCountryElement = this.countrySelectElement.nativeElement as HTMLSelectElement;
      let countryOptionValue = getCountryElement.selectedIndex;
      if(countryOptionValue != 0){
        this.countrySelectElement.nativeElement.classList.remove("dd-placeholder");
        this.stateSelectElement.nativeElement.classList.add("dd-placeholder");
      }else if(countryOptionValue == 0){
        this.countrySelectElement.nativeElement.classList.add("dd-placeholder");
      }
    //To set placeholders for Country and State --end here
  }
  onChangeState() {
    this.formGroup.get('zip').errors.stateEmpty = null;

    //To set placeholders for State --start here
      let getStateElement = this.stateSelectElement.nativeElement as HTMLSelectElement;
      let stateOptionValue = getStateElement.selectedIndex;
      if(stateOptionValue != -1){
        this.stateSelectElement.nativeElement.classList.remove("dd-placeholder");
      }else if(stateOptionValue == -1){
        this.stateSelectElement.nativeElement.classList.add("dd-placeholder");
      }
    //To set placeholders for Country and State --end here
  }

  onClickShipping() {

    if (this.isMobile && this.phoneForm.valid) {
      this.formGroup.get('email').setErrors(null);
      this.formGroup.value.dialCode = this.phoneForm.value.phone.dialCode;
    }

    if (this.formGroup.valid) {
      localStorage.setItem('info', JSON.stringify(this.formGroup.value));
      if (this.formGroup.value.isSaveInfo) {
        
      }
      this.addCustomer(this.formGroup.value);
      this.common.navigate('/checkout-shipping');
    }
  }

  onClickPayment() {
    if (this.formGroup.valid) {
      this.common.navigate('/checkout-payment');
    }
  }

  onClickReturn() {
    this.common.navigate('/cart-page');
  }


  addCustomer(data) {
    this.apiService.isLoading.next(true);
    this.subScription = this.apiService.addCustomer(data).subscribe((res: any) => {
      console.log('cus res', res);
      if (res.status === "7400") {
      }
      //else
      //this.toastr.error(res.message, "Error");
      this.apiService.isLoading.next(false);
    }, err => {
      this.apiService.isLoading.next(false);
    })
  }

  getCountries() {
    this.apiService.isLoading.next(true);
    this.subScription = this.apiService.getCountries().subscribe((res: any) => {
      console.log('country res', res);
      if (res.status === "7400") {
        this.state = null;
        this.countryList = res.value;
        if(this.profile?.addresses[0]){
          this.getStates(this.profile?.addresses[0].country_code);
        }else if (this.info != null) {
          this.getStates(this.info.country.shortName);
        }
      }
      //else
      //this.toastr.error(res.message, "Error");
      this.apiService.isLoading.next(false);
    }, err => {
      this.apiService.isLoading.next(false);
    })
  }

  getStates(country) {
    this.apiService.isLoading.next(true);
    this.subScription = this.apiService.getStates(country).subscribe((res: any) => {
      console.log('state res', res);
      if (res.status === "7400") {
        this.stateList = res.value;
        if(this.profile?.addresses[0]){
          this.country = this.countryList.find(item=>item.shortName==country);
          this.state = this.profile?.addresses[0].province;
          this.formGroup.get('province').setValue(this.state);
          this.formGroup.get('country').setValue(this.country);
          this.formGroup.get('zip').setValue(this.profile?.addresses[0].zip);
        }else if (this.info != null) {
          this.country = this.info.country;
          this.state = this.info.province;
          this.formGroup.get('province').setValue(this.info.province);
          this.formGroup.get('country').setValue(this.info.country);
          if (this.info.dialCode) {
            this.prevCode = this.info.dialCode;
          }
          this.formGroup.patchValue(this.info);
        }

      }
      //else
      //this.toastr.error(res.message, "Error");
      this.apiService.isLoading.next(false);
    }, err => {
      this.apiService.isLoading.next(false);
    })
  }
  getPrismicDatas() {
    let ogSection: any;
    let seoSection: any;
    let twitterSection: any;
    let id = this.constant['checkoutInformation']
    let lang = this.langkey
    return Prismic.api("https://9mmenergydrink.prismic.io/api/v2").then(function (api) {
      return api.query(Prismic.Predicates.at('document.id', id),{ lang : lang});
    }).then((function (response) {
      if(response?.results[0]?.data?.page_title){
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
          default:
            console.log("type:", prismic)
        }
      })
      this.commonMtd.addMetaTag(seoSection, ogSection, twitterSection);

    }).bind(this), function (err) {
      console.log("Something went wrong: ", err);
    });
  }
  isCollapsed=true;
}
