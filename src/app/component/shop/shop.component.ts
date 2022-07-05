import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Prismic from 'prismic-javascript';
import { Subscription } from 'rxjs';
import { CommonMethods } from 'src/app/common/common-methods';
import { ApiService } from 'src/app/services/api.service';
import { AddToCartComponent } from 'src/app/shared/add-to-cart/add-to-cart.component';
import { prismicEnConstants } from 'src/app/common/prismic-Enconstants';
import { prismicFrConstants } from 'src/app/common/prismic-Frconstants';
import { ActivatedRoute } from '@angular/router';
import { CommonMethodsService } from 'src/app/shared/common-methods/common-methods.service';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  pageTitle = "";
  page = 1;
  pageSize = 6;
  headerSection: any;
  footerSection: any;
  bannerSection: any;
  productSection: any;
  sponserSection: any;
  testimonialSection: any;
  clientSection;
  constant: any;
  langkey: any;
  cartCount;// = JSON.parse(localStorage.getItem('cartCount'));
  private subScription: Subscription;
  collections = [];
  products = [];
  empty = false;
  cIndex = 0;
  common;
  fragment: any;
  apiUrl: any;
  constructor(public translate: TranslateService, private route: ActivatedRoute, private apiService: ApiService, public router: Router,
    private modalService: NgbModal, private toastr: ToastrService, private commonMtd: CommonMethodsService) {
      this.cartCount = commonMtd.getCartCountDetails();
    commonMtd.addIndexMeta(true);
    this.common = new CommonMethods(router);
  }

  ngOnInit(): void {
    let domainLanguage = this.commonMtd.getSubDomainLanguage();
    this.constant = domainLanguage.constant;
    this.langkey = domainLanguage.langkey;
    this.apiUrl = domainLanguage.apiUrl;

    this.common.clear();
    if (environment.mainDomain.includes(origin) || environment.europeDomain.includes(origin))
      this.getCollections();
    this.getPrismicDatas();
    this.route.fragment.subscribe(fragment => { this.fragment = fragment; });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if(this.fragment || (this.apiService.previousUrl && this.apiService.previousUrl == this.router.url)){
        document.getElementById('down').scrollIntoView();
      }
    }, 1500);
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }
  getCollections() {
    this.collections = [];
    this.apiService.isLoading.next(true);
    this.subScription = this.apiService.getCollections().subscribe((res: any) => {
      console.log("clist:", res);
      if (res.status === "7400") {
        if (res.value != null)
          this.collections = res.value;
        this.onClickCollection(this.collections[0], 0);
      } else {
        //collection list not found
      }
    }, err => {
      this.apiService.isLoading.next(false);
    })
  }

  getProducts(collectionId) {
    this.apiService.isLoading.next(true);
    this.products = [];
    this.empty = false;
    this.subScription = this.apiService.getProducts(collectionId).subscribe((res: any) => {
      if (res.status === "7400") {
        let tempArray = []; // 8.4 fluid ounce product list
        let tempArray1 = []; // 12 ounce product list
        if (res.value != null){
          res.value.forEach(item => {
            
            item.variants.forEach(varnt => {
                let tempItem = JSON.parse(JSON.stringify(item));
              tempItem.variants = [];
              tempItem.variants.push(varnt);
              for (let img of item.images) {
                if (img.id==varnt.image_id) {
                  tempItem.image = img;
                  break;
                }
              }
              if(varnt?.title?.includes("8.4"))
              tempArray.push(tempItem);
              else
              tempArray1.push(tempItem);
            
            });
            
          });
        }
        tempArray.push(...tempArray1);
        this.products = tempArray;
      } else {

        //collection list not found
      }
      if (this.products != null && this.products.length > 0) {
        this.empty = false;
      } else {
        this.empty = true;
      }
      this.apiService.isLoading.next(false);
    }, err => {
      this.empty = true;
      this.products = [];
      this.apiService.isLoading.next(false);
    })
  }

  onClickCollection(data, i) {
    this.cIndex = i;
    this.getProducts(data.id);
  }

  onClickProduct(data) {
    let title = data.title ? data.title.replaceAll(" - ", "-") : "";
    title = title ? title.replaceAll(" ", "-") : "";
   // this.router.navigate([this.commonMtd.getRoutePath('shop'), title.toLowerCase()], { queryParams: { code: data.id,key:data.variants[0].sku?.toLowerCase() } });
   this.router.navigate([this.commonMtd.getRoutePath('shop'), title.toLowerCase(), data?.id, data?.variants[0]?.sku?.toLowerCase()]);
  }

  onClickCart(product, event?) {
    event.stopPropagation(); //To prevent parent click event when the clicks on cart button
    let quantity = 1;
    let variants = product.variants[0];
    if (variants.inventory_policy == "deny") {
      if (variants.inventory_quantity < 1) {
        //inventory quantity is zero
        this.toastr.error(product.title + " - " + variants.title + this.translate.instant('outOfStock'), this.translate.instant('error'));
        return;
      } else if ((quantity) > variants.inventory_quantity) {
        //quantity exceeds inventory quantity
        this.toastr.error( this.translate.instant('all') + product.title + " - " + variants.title + this.translate.instant('areCart'), this.translate.instant('error'));
        return;
      }
    }

    //new start here
    let userEmail = localStorage.getItem('email');
    let cartDet = this.commonMtd.checkEmpty(JSON.parse(localStorage.getItem('cartDetails')), []);
    if (!userEmail || userEmail == 'null') {
      let cartDetList = cartDet.find(item => (item == null || item?.email == null || item?.email == ''));

      let res = this.commonMtd.getCartList(cartDetList, variants, quantity, product, this.toastr);

      if (res?.cartDetList && res?.prevCount) {
        let cartDetailIndex;
        cartDetailIndex = cartDet.findIndex(item => (item == null || item?.email == null || item?.email == ''));
        if (cartDetailIndex != null && cartDetailIndex > -1) {
          cartDet[cartDetailIndex] = { email: userEmail, list: res.cartDetList, countDetails: res.prevCount, 
            cartId:(cartDet[cartDetailIndex]?.cartId)?cartDet[cartDetailIndex].cartId: null };
        } else {
          cartDet.push({ email: userEmail, list: res.cartDetList, countDetails: res.prevCount, cartId:'' });
        }
        // localStorage.setItem('cartCount', JSON.stringify(prevCount));
        localStorage.setItem('cartDetails', JSON.stringify(cartDet));
        this.cartCount = res.prevCount;
      }
    } else {
      let cartDetList = cartDet.find(item => (item?.email == userEmail));
      let res = this.commonMtd.getCartList(cartDetList, variants, quantity, product, this.toastr);


      if (res?.cartDetList && res?.prevCount) {
        let cartDetailIndex = cartDet.findIndex(item => (item?.email == userEmail));
        if (cartDetailIndex != null && cartDetailIndex > -1) {
          cartDet[cartDetailIndex] = { email: userEmail, list: res.cartDetList, countDetails: res.prevCount,
            cartId:(cartDet[cartDetailIndex]?.cartId)?cartDet[cartDetailIndex].cartId: null };

        } else {
          cartDet.push({ email: userEmail, list: res.cartDetList, countDetails: res.prevCount, cartId:'' });
        }
        // localStorage.setItem('cartCount', JSON.stringify(prevCount));
        localStorage.setItem('cartDetails', JSON.stringify(cartDet));
        this.cartCount = res.prevCount;
      }
    }

    // this.cartDetails = cartDetails;
    const modalRef = this.modalService.open(AddToCartComponent, { windowClass: "custom-class", scrollable: true });
    modalRef.componentInstance.cartDetails = cartDet;

    modalRef.result.then((data) => {
      // console.log("on close");
      this.cartCount = JSON.parse(JSON.stringify(this.commonMtd.getCartCountDetails()));
     }, (reason) => {
      // console.log("on dismiss");
      this.cartCount = JSON.parse(JSON.stringify(this.commonMtd.getCartCountDetails()));
    })
  }

  getProductClass(i) {
    i = i + 1;
    let pos = i % 9;

    if (pos == 2 || pos == 7 || pos == 0) {
      return 'productImageClass1';
    } else {
      return 'productImageClass';
    }
    if (pos == 0) {
      return 'productImageClass0';
    }
    else if (pos == 1) {
      return 'productImageClass1';
    }
    else if (pos == 2) {
      return 'productImageClass2';
    }
    else if (pos == 3) {
      return 'productImageClass3';
    }
    else if (pos == 4) {
      return 'productImageClass4';
    }
    else if (pos == 5) {
      return 'productImageClass5';
    }
    else if (pos == 6) {
      return 'productImageClass6';
    }
    else if (pos == 7) {
      return 'productImageClass7';
    }
    else if (pos == 8) {
      return 'productImageClass8';
    }
    else if (pos == 9) {
      return 'productImageClass9';
    }
    //else{
    //return 'productImageClass2';
    //}
  }
  
  gotoReadMore() {
    // this.common.navigate('/read-more', "shop");
    document.getElementById('down').scrollIntoView();
  }

  getPrismicDatas() {
    let ogSection: any;
    let seoSection: any;
    let twitterSection: any;
    let id = this.constant['shopId']
    let lang = this.langkey
    return Prismic.api(this.apiUrl).then(function (api) {
      return api.query(Prismic.Predicates.at('document.id', id), { lang: lang });
    }).then((function (response) {
      if (response?.results[0]?.data?.page_title) {
        this.pageTitle = response.results[0].data.page_title
      }

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
          case 'bannersection':
          case 'banner_section':
            this.bannerSection = prismic;
            this.bannerSection.primary.bannerimage.url = "url(" + this.bannerSection.primary.bannerimage.url + ")";
            break;
          case 'productsection':
            this.productSection = prismic;
            break;
          case 'sponsersection':
            this.sponserSection = prismic;
            break;
          case 'testimonialsection':
            this.testimonialSection = prismic;
            break;
          case 'icon_section':
            this.clientSection = prismic;
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
