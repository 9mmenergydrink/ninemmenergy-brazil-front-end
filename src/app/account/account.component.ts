import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import Prismic from 'prismic-javascript';
import { Subscription } from 'rxjs';
import { ApiService } from '../services/api.service';
import {TranslateService} from '@ngx-translate/core';
import { Router } from '@angular/router';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import { CommonMethods } from 'src/app/common/common-methods';
import { CommonMethodsService } from '../shared/common-methods/common-methods.service';

let self;

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  public isCollapsed = false;
  pageTitle = "";
  footerSection;
  headerSection;
  cartCount;// = JSON.parse(localStorage.getItem('cartCount'));
  activeTab = 'orders';
  email: string;
  private subScription: Subscription;
  accountData: any;
  orderData: any;
  common;
  sideBarMenuSection;
  profile;
  address;
  customerId = "";
  constant: any;
  langkey: any;
  apiUrl: any;
  constructor(private apiService: ApiService, private toastr: ToastrService, public router: Router, public translate: TranslateService, 
    public commonMtd: CommonMethodsService){
    this.cartCount = commonMtd.getCartCountDetails();
    commonMtd.addIndexMeta();
    this.email = localStorage.getItem('email');
    this.common = new CommonMethods(router);  
    translate.use(localStorage.getItem('language'));
    self = this;
    commonMtd.cancelSuccess.subscribe((v) => {
      if(v){
        console.log("reload order list");
        this.getAccountData();
      }
    });
  }

  ngOnInit(): void {
    let domainLanguage = this.commonMtd.getSubDomainLanguage();
    this.constant = domainLanguage.constant;
    this.langkey = domainLanguage.langkey;
    this.apiUrl = domainLanguage.apiUrl;
    this.getPrismicDatas();
    this.getCountries();
    this.getAccountData();
  }
  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }
  
  getPrismicDatas() {
    let ogSection: any;
    let seoSection: any;
    let twitterSection: any;
    let id = this.constant['myAccountId'];
    let lang = this.langkey;
    return Prismic.api(this.apiUrl).then(function (api) {
      return api.query(Prismic.Predicates.at('document.id', id),{ lang : lang});
    }).then((function (response) {
      response.results[0]?.data?.body.forEach(prismic => {
        switch (prismic.slice_type) {
          case 'seo_section':
            seoSection = prismic;
            break;
          case 'ogsection':
            ogSection = prismic;
            break;
          case 'twitter_section':               
            twitterSection = prismic;
            break;
            case 'side_bar_menu_section':
              this.sideBarMenuSection = prismic;
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

  getAccountData() {
    this.apiService.isLoading.next(true);
    this.subScription = this.apiService.getCustomerDetailsByEmail(this.email).subscribe((res: any) => {
      if (res.status === "7400") {
        this.accountData = res.value;        
          // console.log(this.accountData);
          //let name = '';
          // let shortName = '';
          // if(this.accountData?.first_name?.length > 0){
          //   name = this.accountData?.first_name;
          //   shortName = this.accountData?.first_name[0];
          // }
    
          // if(this.accountData?.last_name?.length > 0){
          //   name += " " + this.accountData?.last_name;
          //   shortName += this.accountData?.last_name[0];
          // }

          let nameObj = this.commonMtd.getShortName(this.accountData);
          this.accountData.addresses = this.accountData.addresses.filter(item => item.default == false);
          this.accountData.addresses.reverse();
          if(this.accountData?.default_address != null)
           this.accountData.addresses.unshift(this.accountData?.default_address);
          
        
        // this.order = {
        //   orderId: this.accountData?.last_order_id,
        //   orderName: this.accountData?.last_order_name,
        //   orderCount: this.accountData?.orders_count,
        //   orderList: this.accountData?.orderList
        // };

        this.profile = {
          email: this.accountData?.email,
          firstName: this.accountData?.first_name,
          lastName: this.accountData?.last_name,
          id: this.accountData?.id,
          currency: this.accountData?.currency,
          phone: this.accountData?.phone,
          name:nameObj.name,
          shortName:nameObj.shortName.toUpperCase(),
          accepts_marketing: this.accountData?.accepts_marketing,
          addresses: this.accountData?.addresses
        };
        localStorage.setItem("profile", JSON.stringify(this.profile));
        this.apiService.userShortName.next(nameObj.shortName.toUpperCase());
        // this.cartCount = JSON.parse(localStorage.getItem('cartCount'));

        this.address = {
          customerId: this.accountData?.id,
          addresses:this.accountData?.addresses
        }
        this.customerId = this.accountData?.id;
        this.getOrdersDetails(this.customerId);
      }
      else{
        if(res.status != "7407")
        this.toastr.error(res.message, this.translate.instant('error'));
        this.router.navigateByUrl("/login");
      }
        this.apiService.isLoading.next(false);
    }, err => {
      this.apiService.isLoading.next(false);
    //  this.router.navigateByUrl("/login");
    })
  }
  // Get tab click event
  tabClickEvent(name) {
    if(name == 'orders') {
      this.getOrdersDetails(this.customerId);
      this.activeTab = name;
    }
    if (name !== this.activeTab)
    this.activeTab = name;
  }

  countries;
  getCountries() {
    this.apiService.isLoading.next(true);
    this.subScription = this.apiService.getCountries().subscribe((res: any) => {
      if (res.status === "7400") {
        this.countries = res.value;
      }
      //else
      //this.toastr.error(res.message, "Error");
      this.apiService.isLoading.next(false);
    }, err => {
      this.apiService.isLoading.next(false);
    })
  }

  getOrdersDetails(customerId) {
    this.apiService.getOrdersDetails(customerId, "after:null", "first:2", 'null').subscribe((res: any) => {
      if (res.status === "7400" && res?.value?.data?.customer?.orders) {
        res.value.data.customer.orders.customerId = customerId;
        this.orderData = res.value.data.customer.orders;
      }else{
        this.orderData = res?.value;
      }
      this.apiService.isLoading.next(false);
    }, err => {
      this.orderData = err;
      this.apiService.isLoading.next(false);
    })
  }

}
