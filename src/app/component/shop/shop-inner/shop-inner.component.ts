import { Component, OnInit, ViewEncapsulation, Renderer2, Inject, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Prismic from 'prismic-javascript';
import { CommonMethods } from 'src/app/common/common-methods';
import { ApiService } from 'src/app/services/api.service';
import { AddToCartComponent } from 'src/app/shared/add-to-cart/add-to-cart.component';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonMethodsService } from 'src/app/shared/common-methods/common-methods.service';
import { DOCUMENT, Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-shop-inner',
  templateUrl: './shop-inner.component.html',
  styleUrls: ['./shop-inner.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShopInnerComponent implements OnInit {
  pageTitle = "";
  shopinnerUrl: any;
  constant: any;
  langkey: any;
  apiUrl: any;
  headerSection: any;
  footerSection: any;
  productSection: any;
  sponserSection: any;
  testimonialSection: any;
  ogSection: any;
  seoSection: any;
  shareSection;
  product: any;
  productImage: any = { src: "", alt: "" };
  productViewImage: any = { src: "", alt: "" };
  productMainImage = '';
  quantity = 1;
  cartDetails = [];
  cartCount;// = JSON.parse(localStorage.getItem('cartCount'));
  common;
  mlIndex = 0;
  formGroup: FormGroup;
  productId;
  productSku;
  constructor(public translate: TranslateService, private apiService: ApiService, private modalService: NgbModal,
    public router: Router, private toastr: ToastrService, private formBuilder: FormBuilder,
    private route: ActivatedRoute, private metaTagService: Meta, private titleService: Title,
    public commonMtd: CommonMethodsService, private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document, private ref: ChangeDetectorRef,
    private location:Location) {
    this.cartCount = commonMtd.getCartCountDetails();
    commonMtd.addIndexMeta(true);
    this.common = new CommonMethods(router);

    if (this.route?.snapshot?.params['title'] && this.route?.snapshot?.params['code'] && this.route?.snapshot?.params['key']) {
      let paramsTitle = this.route.snapshot.params['title'];
      this.productId = this.route.snapshot.params['code'];//this.route.snapshot.queryParams.code;
      this.productSku = this.route.snapshot.params['key'];//this.route.snapshot.queryParams.key;

      this.shopinnerUrl = environment.uiUrl + 'shop/' + paramsTitle;
      this.productTitle = paramsTitle != null ? paramsTitle.replaceAll("-", " ") : "";
    } else {
      this.router.navigateByUrl("/**");
    }
    
   /* let paramsTitle = this.route.snapshot.params['title'];
    this.shopinnerUrl = environment.uiUrl + 'shop/' + paramsTitle;
    this.productTitle = paramsTitle != null ? paramsTitle.replaceAll("-", " ") : "";

    this.productId = this.route.snapshot.queryParams.code?parseInt(this.route.snapshot.queryParams.code):0;
    this.productSku = this.route.snapshot.queryParams.key?this.route.snapshot.queryParams.key:"";  */ 
  }

  onClick() {
    if (this.variants.inventory_policy == 'continue' || this.variants.inventory_quantity > 0) {
      const lineItems = [
        {
          //variantId: btoa(this.variants.admin_graphql_api_id), //For checkout creation. Commented for not used checkout creation process on 21-04-22
          quantity: this.quantity,
          merchandiseId: btoa(this.variants.admin_graphql_api_id),//For cart creation.
          attributes: []
        }
      ];
      this.commonMtd.createCart(lineItems);
      // this.common.onClick(router, this.product, this.variants, this.quantity, this.productMainImage);
    } else {
      this.toastr.error(this.product.title + " - " + this.variants.title + this.translate.instant('outOfStock'), this.translate.instant('error'));
      return;
    }
  }

  ngOnInit(): void {
    localStorage.setItem('currPrd', null);
    let domainLanguage = this.commonMtd.getSubDomainLanguage();
    this.constant = domainLanguage.constant;
    this.langkey = domainLanguage.langkey;
    this.apiUrl = domainLanguage.apiUrl;

    this.common.clear();
    if (environment.mainDomain.includes(origin) || environment.europeDomain.includes(origin)) {
      let data = localStorage.getItem("isLoadingFirst")
      if(data == 'false')
      return;
      this.getProductDetails();
    }

    this.formGroup = this.formBuilder.group({
      'display_name': ['', Validators.required],
      'email': ['', Validators.compose([Validators.required, Validators.email])],
      'review_title': [null, Validators.required],
      'review_content': [null, Validators.required],
      'review_score': [null, Validators.required]
    });

  }

  addProductSchemaScript() {
    /*schema script*/
    let tmp = document.createElement('DIV');
    tmp.innerHTML = (this.product?.body_html) ? this.product.body_html : '';
    var description = tmp.textContent || tmp.innerText || '';

    let productSchema = this._renderer2.createElement('script');
    productSchema.type = `application/ld+json`;
    productSchema.text = `
      {
        "@context": "https://schema.org/", 
        "@type": "Product", 
        "name": "${this.product?.title || ''}",
        "image": "${this.product?.image?.src || ''}",
         "description": "${description}",
        "brand": "Pie Wine",
        "offers": {
          "@type": "Offer",
          "url": "${window.location.href}",
          "priceCurrency": "USD",
          "price": "${this.product?.variants[0]?.price || ''}",
          "availability": "https://schema.org/OnlineOnly",
          "itemCondition": "https://schema.org/NewCondition"
        }
      
      }
      `;
    this._renderer2.appendChild(this._document.head, productSchema);

    /*schema script*/
  }

  productTitle: any = "";
  getProductDetails() {
    this.apiService.isLoading.next(true);
    this.subScription = this.apiService.getProductDetailsById(this.productId).subscribe((res: any) => {
      if (res?.status === "7400" && res?.value != null) {
        if (!res?.value?.title || this.productTitle?.toLowerCase() != res?.value?.title?.toLowerCase()) {
          this.router.navigateByUrl("/**");
        }

        this.product = res.value;
        //this.quantity=this.product.variants[0].inventory_quantity;
        this.product?.variants.forEach((item,index) => {
          if(this.productSku?.toLowerCase() == item?.sku?.toLowerCase()){
            this.onClickSize(item, index, true);
            return;
          }
        });

        if (!this.variants)
          this.router.navigateByUrl("/**");
      /*  this.variants = this.product?.variants[0];
        this.productImage = this.product?.image; //For Slider
        this.productViewImage = this.product?.image;
        this.productMainImage = this.product?.image.src;*/
        this.getPrismicDatas();
        this.addProductSchemaScript();
        this.getProductReview();
      } else {
        this.router.navigateByUrl("/**");
        //product list not found
      }

      this.apiService.isLoading.next(false);
    }, err => {
      this.router.navigateByUrl("/**");
      this.apiService.isLoading.next(false);
    })
  }

  onClickProduct(data) {
    this.productViewImage = data;
  }
  variants;// = {inventory_policy:'deny',inventory_quantity:0};
  onClickSize(data, i, isDontReplaceState?) {
   //if(!isDontReplaceState){
     this.location.replaceState(this.commonMtd.getRoutePath('shop') + "/" + 
                                this.route.snapshot.params['title'] + '/' + this.product?.id +
                                '/'+ data?.sku?.toLowerCase());
  //  }
    this.mlIndex = -1;
    this.mlIndex = JSON.parse(JSON.stringify(i));
    this.quantity = 1;
    this.variants = JSON.parse(JSON.stringify(data));
    for (let item of this.product.images) {
      if (item.id == data.image_id) {
        this.productImage = item;
        this.productViewImage = item;
        this.productMainImage = item.src;
        break;
      }
    }
    /*for (let item of this.product.variants) {
      if (item.title == data) {
        this.quantity = 1;
        this.variants = item;
        break;
      }
    }*/
  }

  gotoReadMore() {
    // this.common.navigate('/read-more', "shop");
    this.router.navigate([this.commonMtd.getRoutePath('shop')], { fragment: 'down' });
  }

  onClickCart() {
    if (this.variants.inventory_policy == 'deny') {
      if (this.variants.inventory_quantity < 1) {
        //inventory quantity is zero
        this.toastr.error(this.product.title + " - " + this.variants.title + this.translate.instant('outOfStock'), this.translate.instant('error'));
        return;
      } else if ((this.quantity) > this.variants.inventory_quantity) {
        //quantity exceeds inventory quantity
        this.toastr.error(this.translate.instant('all') + this.product.title + " - " + this.variants.title + this.translate.instant('areCart'), this.translate.instant('error'));
        return;
      }
    }

    //new start here
    let userEmail = localStorage.getItem('email');
    let cartDet = this.commonMtd.checkEmpty(JSON.parse(localStorage.getItem('cartDetails')), []);
    if (!userEmail || userEmail == 'null') {
      let cartDetList = cartDet.find(item => (item == null || item?.email == null || item?.email == ''));

      let res = this.commonMtd.getCartList(cartDetList, this.variants, this.quantity, this.product, this.toastr, this.productImage);

      if (res?.cartDetList && res?.prevCount) {
        let cartDetailIndex = cartDet.findIndex(item => (item == null || item?.email == null || item?.email == ''));
        if (cartDetailIndex != null && cartDetailIndex > -1) {
          cartDet[cartDetailIndex] = {
            email: userEmail, list: res.cartDetList, countDetails: res.prevCount,
            cartId: (cartDet[cartDetailIndex]?.cartId) ? cartDet[cartDetailIndex].cartId : null
          };

        } else {
          cartDet.push({ email: userEmail, list: res.cartDetList, countDetails: res.prevCount, cartId:'' });
        }
        // localStorage.setItem('cartCount', JSON.stringify(prevCount));
        localStorage.setItem('cartDetails', JSON.stringify(cartDet));
        this.cartCount = res.prevCount;
        this.cartDetails = res.cartDetList;

      }
    } else {
      let cartDetList = cartDet.find(item => (item?.email == userEmail));
      let res = this.commonMtd.getCartList(cartDetList, this.variants, this.quantity, this.product, this.toastr, this.productImage);


      if (res?.cartDetList && res?.prevCount) {
        let cartDetailIndex = cartDet.findIndex(item => (item?.email == userEmail));
        if (cartDetailIndex != null && cartDetailIndex > -1) {
          cartDet[cartDetailIndex] = {
            email: userEmail, list: res.cartDetList, countDetails: res.prevCount,
            cartId: (cartDet[cartDetailIndex]?.cartId) ? cartDet[cartDetailIndex].cartId : null
          };

        } else {
          cartDet.push({ email: userEmail, list: res.cartDetList, countDetails: res.prevCount, cartId:'' });
        }
        // localStorage.setItem('cartCount', JSON.stringify(prevCount));
        localStorage.setItem('cartDetails', JSON.stringify(cartDet));
        this.cartCount = res.prevCount;
        this.cartDetails = res.cartDetList;

      }
    }
    let modalRef = this.modalService.open(AddToCartComponent, { windowClass: "custom-class", scrollable: true });
    //modalRef.componentInstance.cartDetails = cartDetails;

    modalRef.result.then((data) => {
      // console.log("on close");
      this.cartCount = JSON.parse(JSON.stringify(this.commonMtd.getCartCountDetails()));
    }, (reason) => {
      // console.log("on dismiss");
      this.cartCount = JSON.parse(JSON.stringify(this.commonMtd.getCartCountDetails()));
    })
  }

  plus() {
    if (this.variants.inventory_policy == 'continue' || this.quantity < this.variants.inventory_quantity) {
      this.quantity += 1;
    } else if (this.variants.inventory_policy == 'deny' && this.variants.inventory_quantity < 1) {
      //inventory quantity is zero
      this.toastr.error(this.product.title + " - " + this.variants.title + this.translate.instant('outOfStock'), this.translate.instant('error'));
    } else {
      //quantity exceeds inventory quantity
      this.toastr.error(this.translate.instant('all') + this.product.title + " - " + this.variants.title + this.translate.instant('areCart'), this.translate.instant('error'));
      return;
    }
  }

  minus() {
    if (this.quantity > 1) {
      this.quantity -= 1;
    }
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  getPrismicDatas() {
    let id = this.constant['shopinner'];
    let lang = this.langkey
    return Prismic.api(this.apiUrl).then(function (api) {
      //return api.query(Prismic.Predicates.at('document.id', 'YJuY_REAACEAO6TD'));
      return api.query(Prismic.Predicates.at('document.id', id), { lang: lang });
    }).then((function (response) {
      if (response?.results[0]?.data?.page_title) {
        this.pageTitle = response.results[0].data.page_title
      }
      response.results[0]?.data?.body.forEach(prismic => {
        switch (prismic.slice_type) {
          case 'seo_section':
            console.log("seosection:", prismic);
            this.seoSection = prismic;
            break;
          // case 'og_section':
          //   console.log("ogsection:", prismic);
          //   this.ogSection = prismic;
          //   break;
          case 'share_section':
            console.log("share_section:", prismic)
            this.shareSection = prismic;
            break;
          case 'sponsorsection':
            this.sponserSection = prismic;
            break;
          case 'testmonialsection':
            console.log("testmonialsection:", prismic)
            this.testimonialSection = prismic;
            break;
          default:
            console.log("type:", prismic.slice_type)
        }
      })
      this.setMetaTags();
    }).bind(this), function (err) {
      console.log("Something went wrong: ", err);
    });
  }

  setMetaTags() {
    let title = this.productTitle;
    let description = this.product?.body_html;
    this.seoSection.items.forEach(seoData => {
      if (seoData.product_name?.toLowerCase() == this.productTitle?.toLowerCase()) {
        if (seoData?.title) {
          title = seoData?.title;
          this.titleService.setTitle(seoData?.title);
        }
        if (seoData?.description) {
          description = seoData?.description;
          this.metaTagService.updateTag(
            { name: 'description', content: seoData?.description }, "name='description'"
          );
        } else {
          this.metaTagService.removeTag("name='description'");
        }

      }
    })
    //OG and Twitter Meta Tag 
    this.metaTagService.updateTag(
      { name: 'og:site_name', content: '9mmenergy' }, "name='og:site_name'"
    );

    if (this.shopinnerUrl) {
      this.metaTagService.updateTag(
        { name: 'og:url', content: this.shopinnerUrl }, "name='og:url'"
      );
      this.metaTagService.updateTag(
        { name: 'twitter:url', content: this.shopinnerUrl }, "name='twitter:url'"
      );
    }
    else {
      this.metaTagService.removeTag("name='og:url'");
      this.metaTagService.removeTag("name='twitter:url'");
    }

    if (title) {
      this.metaTagService.updateTag(
        { name: 'og:title', content: title }, "name='og:title'"
      );
      this.metaTagService.updateTag(
        { name: 'twitter:title', content: title }, "name='twitter:title'"
      );
    }
    else {
      this.metaTagService.removeTag("name='og:title'");
      this.metaTagService.removeTag("name='twitter:title'");
    }
    this.metaTagService.updateTag(
      { name: 'og:type', content: 'product' }, "name='og:type'"
    );

    if (description) {
      this.metaTagService.updateTag(
        { name: 'og:description', content: description }, "name='og:description'"
      );
      this.metaTagService.updateTag(
        { name: 'twitter:description', content: description }, "name='twitter:description'"
      );
    }
    else {
      this.metaTagService.removeTag("name='og:description'");
      this.metaTagService.removeTag("name='twitter:description'");
    }

    if (this.productImage.src) {
      this.metaTagService.updateTag(
        { name: 'og:image', content: this.productImage.src }, "name='og:image'"
      );
      this.metaTagService.updateTag(
        { name: 'og:image:secure_url', content: this.productImage.src }, "name='og:image:secure_url'"
      );
      this.metaTagService.updateTag(
        { name: 'twitter:image', content: this.productImage.src }, "name='twitter:image'"
      );
    } else {
      this.metaTagService.removeTag("name='og:image'");
      this.metaTagService.removeTag("name='og:image:secure_url'");
      this.metaTagService.removeTag("name='twitter:image'");
    }
    this.metaTagService.updateTag(
      { name: 'twitter:site', content: '@9mmenergy' }, "name='twitter:site'"
    );
    this.metaTagService.updateTag(
      { name: 'twitter:card', content: 'summary_large_image' }, "name='twitter:card'"
    );

  }
  socialShare(media) {
    // const url = encodeURIComponent(window.location.href);
    switch (media) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${this.shopinnerUrl}`);
        break;
      case 'instagram':
        window.open(`https://www.instagram.com/9mmenergydrink1/`);
        break;
      case 'pinterest':
        window.open(`https://www.pinterest.com/pin/create/button/?url=${this.shopinnerUrl}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?source=tweetbutton&url=${this.shopinnerUrl}`);
        break;
      default:
        break;
    }
  }

  isAddReviewShow = false;
  review_score = 0;
  subScription;
  reviewDetails;
  isSubmitted = false;
  page = 1;
  pageSize = 5;
  get f() {
    return this.formGroup.controls;
  }
  getProductReview(v?) {
    if (v)
      return;
    this.apiService.isLoading.next(true);
    this.subScription = this.apiService.getProductReview(this.product.id, 1, 250).subscribe((res: any) => {
      if (res.status === "7400") {
        this.reviewDetails = JSON.parse(JSON.stringify(res.value));
        this.reviewDetails.reviews = JSON.parse(JSON.stringify(res?.value?.reviews));
        console.log("this.reviewData=", this.reviewDetails);
      }
      this.apiService.isLoading.next(false);
    }, err => {
      this.apiService.isLoading.next(false);
      this.toastr.error(this.translate.instant('serverError'), this.translate.instant('error'));
    })

  }

  addReview() {
    // this.formGroup.get('review_score').setValue(this.review_score>0?this.review_score:null);
    if (this.formGroup.valid) {
      this.isSubmitted = false;
      this.apiService.isLoading.next(true);
      this.formGroup.value.sku = this.product.id;
      this.formGroup.value.product_title = this.product.title;
      this.formGroup.value.product_url = window.location.href;//this.product?.image.src; 
      this.subScription = this.apiService.addProductReview(this.formGroup.value).subscribe((res: any) => {
        if (res.status === "7400") {
          //this.reviewDetails = res.value;
          //console.log("this.reviewData=", this.reviewDetails);
          if (res?.value?.status?.code == 200 && res?.value?.response?.reviews[0]) {
            this.toastr.success(this.translate.instant('reviewPosted'));
            this.reviewDetails.reviews.unshift(res.value.response.reviews[0]);
            this.reviewDetails.bottomline.total_review += 1;
          } else {
            this.toastr.error(this.translate.instant('unableToPostReview'));
          }
        } else {
          this.toastr.error(this.translate.instant('unableToPostReview'));
        }
        this.formGroup.reset();
        this.isAddReviewShow = false;

        this.apiService.isLoading.next(false);
      }, err => {
        this.apiService.isLoading.next(false);
        this.toastr.error(this.translate.instant('serverError'), this.translate.instant('error'));
      })
    } else {
      this.isSubmitted = true;
    }
  }

  cancelAddReview() {
    this.isAddReviewShow = false;
    this.formGroup.reset();
    this.isSubmitted = false;
  }
}