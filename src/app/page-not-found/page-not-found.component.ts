import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiService } from '../services/api.service';
import { AddToCartComponent } from '../shared/add-to-cart/add-to-cart.component';
import { CommonMethodsService } from '../shared/common-methods/common-methods.service';
import Prismic from 'prismic-javascript';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {
  page = 1;
  pageSize = 6;
  headerSection: any;
  footerSection: any;
  contentSection;
  constant: any;
  cartCount;
  langkey: any;
  apiUrl: any;
  private subScription: Subscription;
  products=[];
  empty = false;

  constructor(public translate: TranslateService, private apiService: ApiService, public router: Router,private commonMtd: CommonMethodsService,
    private modalService: NgbModal, private toastr: ToastrService) {
    this.cartCount = commonMtd.getCartCountDetails();

   }

  ngOnInit(): void {
    let domainLanguage = this.commonMtd.getSubDomainLanguage();
    this.constant = domainLanguage.constant;
    this.langkey = domainLanguage.langkey;
    this.apiUrl = domainLanguage.apiUrl;

    if (environment.mainDomain.includes(origin) || environment.europeDomain.includes(origin))
      this.getCollections();
    this.getPrismicDatas();
  }

  getPrismicDatas() {
    let ogSection: any;
    let seoSection: any;
    let twitterSection: any;
    let id = this.constant['pageNotId'];
    let lang = this.langkey;
    return Prismic.api(this.apiUrl).then(function (api) {
      return api.query(Prismic.Predicates.at('document.id', id), { lang: lang });
    }).then((function (response) {
      if (response?.results[0]?.data?.page_title) {
        this.pageTitle = response.results[0].data.page_title
      }
      // console.log(response.results[0]?.data)
      response.results[0]?.data?.body.forEach(prismic => {
        switch (prismic.slice_type) {
          case 'seo_section':
            console.log("seo_section:", prismic);
            seoSection = prismic;
          break;
          case 'og_section':
            console.log("og_section:", prismic);
            ogSection = prismic;
            break;
          case 'twitter_section':
            twitterSection = prismic;
            break;
          case 'content_section':
            console.log("contentSection:", prismic);
            this.contentSection = prismic;
            break;
          default:
            console.log("type:", prismic);
        }
      })
      this.commonMtd.addMetaTag(seoSection, ogSection, twitterSection);
    }).bind(this), function (err) {
      console.log("Something went wrong: ", err);
    });
  }

  getCollections() {
    this.apiService.isLoading.next(true);
    this.subScription = this.apiService.getCollections().subscribe((res: any) => {
      console.log("clist:", res);
      if (res.status === "7400") {
        if (res.value != null)
        this.getProducts(res.value[0].id);
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
      console.log("plist:", res);
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

  onClickProduct(data) {
    localStorage.setItem('product', JSON.stringify(data));
    // this.apiService.product = data;
    // this.common.navigate('/shopinner');
    let title = data.title ? data.title.replace(/ - /g, "-") : "";
    title = title ? title.replace(/\s/g, "-") : "";
   // this.router.navigate([this.commonMtd.getRoutePath('shop'), title.toLowerCase()], { queryParams: { code: data.id,key:data.variants[0].sku?.toLowerCase()}});
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
        this.toastr.error("All " + product.title + " - " + variants.title + this.translate.instant('areCart'),  this.translate.instant('error'));
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
          cartDet.push({ email: userEmail, list: res.cartDetList, countDetails: res.prevCount, cartId :'' });
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
          cartDet.push({ email: userEmail, list: res.cartDetList, countDetails: res.prevCount, cartId :'' });
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

  ngOnDestroy() {
    this.modalService.dismissAll();
  }
}
