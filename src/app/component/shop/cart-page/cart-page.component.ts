import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import Prismic from 'prismic-javascript';
import { CommonMethods } from 'src/app/common/common-methods';
import { ApiService } from 'src/app/services/api.service';
import { CommonMethodsService } from 'src/app/shared/common-methods/common-methods.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit {
  pageTitle = "";
  headerSection: any;
  footerSection: any;
  constant: any;
  langkey: any;
  apiUrl: any;
  allProductRemoved = false;
  cartCount;// = JSON.parse(localStorage.getItem('cartCount'));
  cartDetails;
  prevCount;// = JSON.parse(localStorage.getItem('cartCount'));
  common;
  page = 1;
  pageSize = 3;
  cartList = [];
  cartDetailIndex = -1;

  constructor(public translate: TranslateService, private apiService: ApiService, private router: Router, private toastr:ToastrService,
    public commonMtd:CommonMethodsService) {
    commonMtd.addIndexMeta(false,true);
    this.common = new CommonMethods(router);
    this.apiService.cartDetails.subscribe((v) => {
			this.cartList = v?.cartList;
      this.cartCount = v?.cartCountDetail;
		});
  }

  ngOnInit(): void {
    localStorage.setItem('currPrd', null);
    this.common.clear();
    let domainLanguage = this.commonMtd.getSubDomainLanguage();
    this.constant = domainLanguage.constant;
    this.langkey = domainLanguage.langkey;
    this.apiUrl = domainLanguage.apiUrl;
    this.getPrismicDatas();

    let cDetails = this.common.checkEmpty(JSON.parse(localStorage.getItem('cartDetails')), []);
    let userEmail = localStorage.getItem('email');

  if(userEmail && userEmail != 'null'){
      this.cartDetailIndex = cDetails.findIndex(item => (item?.email == userEmail));
      this.cartDetails = cDetails;
      let cartDetail = cDetails[this.cartDetailIndex];
      this.cartCount = (cartDetail?.countDetails)?cartDetail.countDetails:{
				qCount:0,
				pCount:0,
				subTotal:0,
				note:''
			  };
      this.prevCount = this.cartCount;
      this.cartList = (cartDetail?.list)?cartDetail?.list:[];
    }else{
      this.cartDetailIndex = cDetails.findIndex(item => (item == null || item?.email == null || item?.email == ''));
      this.cartDetails = cDetails;
      let cartDetail = cDetails[this.cartDetailIndex];
      this.cartCount = (cartDetail?.countDetails)?cartDetail.countDetails:{
				qCount:0,
				pCount:0,
				subTotal:0,
				note:''
			  };
      this.prevCount = this.cartCount;
      this.cartList = (cartDetail?.list)?cartDetail?.list:[];
    }
    this.getVariantList();
  }
  
  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  getVariantList(){
    this.apiService.isLoading.next(true);
    let ids;
    for(let data of this.cartList){
      if(ids)
      ids += "," +data.variantId;
      else
      ids = data.variantId;
    }

    this.apiService.getVariantList(ids).subscribe((res: any) => {
      if(res?.status == "7400"){
        for(let data of this.cartList){
          let find = res?.value.find(item =>item.id == data.variantId);
          if(find){
            data.inventoryPolicy = find.inventory_policy;
            data.totalQuantity= find.inventory_quantity;
          }

        }
      }
      this.apiService.isLoading.next(false);
    }, err => {
      this.apiService.isLoading.next(false);
    })
  }


  onClickInfo() {
    if(this.cartCount?.pCount > 0){
      const lineItems = [];
      this.cartList.forEach(item => {
        //For checkout creation. Commented for not used checkout creation process on 21-04-22
        /*lineItems.push({
          variantId: btoa(item.variantsGraphqlId),
          quantity: item.quantity
        })*/
       //For cart creation
        lineItems.push({
          quantity: item.quantity,
          merchandiseId: btoa(item.variantsGraphqlId),
          attributes: []
        })

      });
      this.commonMtd.createCart(lineItems, this.cartDetails, this.cartDetailIndex);
      // this.router.navigate(['/checkout-information']);
      //   .then(() => {
      //     window.location.reload();
      //   });
    }else{
      this.toastr.error(this.translate.instant('emptyCartCheckout'));
      return;
    }
  }

  plus(data, i) {
    if ((data?.inventoryPolicy && data.inventoryPolicy == 'continue') || data.quantity < data.totalQuantity ) {
      data.quantity += 1;
      // if(this.prevCount.qCount >= data.quantity)
      this.prevCount.qCount += 1;
      // if(this.prevCount.pCount >= 1)
      // this.prevCount.pCount-=1;
      let subTotal = parseFloat(this.prevCount.subTotal) + (data.price * 1);
      this.prevCount.subTotal = (subTotal).toFixed(2);

      let total = parseFloat(data.total) + (data.price * 1);
      data.total = (total).toFixed(2);

     // this.cartList[i] = Object.assign({}, data);
      // this.cartList = [];
      // this.cartList.push(...Object.assign([], data));
    }else{
      this.toastr.error(data.message, this.translate.instant('stockExceeds') + data.title);
    }
  }
  minus(data, i) {
    if (data.quantity > 1) {
      data.quantity -= 1;

      // if(this.prevCount.qCount >= data.quantity)
      this.prevCount.qCount -= 1;
      if (this.prevCount.qCount < 0) {
        this.prevCount.qCount = 0;
      }

      let subTotal = parseFloat(this.prevCount.subTotal) - (data.price * 1);
      this.prevCount.subTotal = (subTotal).toFixed(2);
      if (this.prevCount.subTotal < 0) {
        this.prevCount.subTotal = 0;
      }

      let total = parseFloat(data.total) - (data.price * 1);
      data.total = (total).toFixed(2);
      if (data.total < 0) {
        data.total = 0;
      }

     // this.cartList[i] = Object.assign({}, data);
      // this.cartList = [];
      // this.cartDetails.push(...Object.assign([], data));
    }
  }

  onClickUpdateCart() {
    this.apiService.isLoading.next(true);
    //localStorage.setItem('cartCount', JSON.stringify(this.prevCount));
    this.cartDetails[this.cartDetailIndex].list = this.cartList;
    this.cartDetails[this.cartDetailIndex].countDetails = this.prevCount;
    localStorage.setItem('cartDetails', JSON.stringify(this.cartDetails));
    this.cartCount = Object.assign({}, this.prevCount);
    this.apiService.isLoading.next(false);
    this.toastr.success(this.translate.instant('cartUpdated'));
  }

  onClickClose(data, i) {
    let index = this.cartList.findIndex(item=>(item.variantId == data.variantId));
    if(index == null || index < 0){
      return;
    }
    //  this.prevCount = JSON.parse(localStorage.getItem('cartCount'));
    if (this.prevCount.qCount >= data.quantity)
      this.prevCount.qCount -= data.quantity;
    if (this.prevCount.pCount >= 1)
      this.prevCount.pCount -= 1;
    let subTotal = parseFloat(this.prevCount.subTotal) - (data.price * data.quantity);
    this.prevCount.subTotal = (subTotal).toFixed(2);
    if (this.prevCount.subTotal < 0) {
      this.prevCount.subTotal = 0;
    }
    this.cartList.splice(index, 1);
    this.allProductRemoved = this.cartList?.length?false:true;
    if (this.cartList.length == this.pageSize && this.page>1) {
      this.page = this.page - 1;
    }

    // localStorage.setItem('cartCount', JSON.stringify(this.prevCount));
    //   localStorage.setItem('cartDetails', JSON.stringify(this.cartDetails));  
    //   this.cartCount = this.prevCount;
  }

  getPrismicDatas() {
    let ogSection: any;
    let seoSection: any;
    let twitterSection: any;
    let id = this.constant['cartPage'];
    let lang = this.langkey;
    return Prismic.api(this.apiUrl).then(function (api) {
      return api.query(Prismic.Predicates.at('document.id', id),{lang : lang});
    }).then((function (response) {
      if(response?.results[0]?.data?.page_title){
        this.pageTitle = response.results[0].data.page_title
      }
      response.results[0]?.data?.body.forEach(prismic => {
        switch (prismic.slice_type) {
          case 'seo_section':
            // console.log("seosection:", prismic);
            seoSection = prismic;
            break;
          case 'ogsection':
            // console.log("ogsection:", prismic);
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
}

