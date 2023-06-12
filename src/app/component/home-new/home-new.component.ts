import { Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import Prismic from 'prismic-javascript';
import "@lottiefiles/lottie-player";
import { CommonMethods } from 'src/app/common/common-methods';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { VideoPopupComponent } from 'src/app/shared/popup/video-popup/video-popup.component';
import { CommonMethodsService } from 'src/app/shared/common-methods/common-methods.service';
import { TranslateService } from '@ngx-translate/core';
import { AddToCartComponent } from 'src/app/shared/add-to-cart/add-to-cart.component';
import { ApiService } from 'src/app/services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home-new',
  templateUrl: './home-new.component.html',
  styleUrls: ['./home-new.component.css']
})
export class HomeNewComponent implements OnInit {
  @ViewChild("content") modalContent: TemplateRef<any>;
  pageTitle = "";
  headerSection: any;
  footerSection: any;
  sliderSection: any;
  video2Section: any;
  folksSection: any;
  blogSection: any;
  testimonialSection: any;
  socialProofSection: any;
  sportsIcon;
  videoSection1;
  productSection;
  creativeSection;
  mmaEvents;
  motorcycleSportsSection;

  cartCount;// = JSON.parse(localStorage.getItem('cartCount'));
  common;
  items = [];
  ngForm: FormGroup;
  blogPrimary: any;
  categorySection: any;
  language: any;
  constant: any;
  langkey: any;
  apiUrl: any;
  products=[];
  empty = false;
  page = 1;
  pageSize = 6;

  private subScription: Subscription;
  constructor(public translate: TranslateService, private datepipe: DatePipe,private apiService: ApiService, private modalService: NgbModal, private formBuilder: FormBuilder, private router: Router, public commonMtd: CommonMethodsService, private toastr: ToastrService) 
  {
    this.cartCount = commonMtd.getCartCountDetails();
    commonMtd.addIndexMeta(false,false);      
    this.common = new CommonMethods(router);
  }

  ngOnInit(): void {
    let domainLanguage = this.commonMtd.getSubDomainLanguage();
    this.constant = domainLanguage.constant;
    this.langkey = domainLanguage.langkey;
    this.apiUrl = domainLanguage.apiUrl;

   // if (environment.mainDomain.includes(origin) || environment.europeDomain.includes(origin))
      this.getCollections();

    this.getPrismicDatas();
    this.getHeaderFooterDatas();

    localStorage.setItem('menu', 'home');
    this.common.clear();
    this.ngForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])],
    })
  }  

  playVideo(url) {
    const modalRef = this.modalService.open(VideoPopupComponent, { size: 'xl',centered: true,windowClass: 'modal-custom'});
     modalRef.componentInstance.setVideoUrl = url;
  }

  gotoShop(){
    this.router.navigate([this.commonMtd.getRoutePath('shop')], { fragment: 'down' });
  }
  getHeaderFooterDatas() {
    let id = this.constant['headerId']
    let lang = this.langkey
    return Prismic.api(this.apiUrl).then(function (api) {
      return api.query(Prismic.Predicates.at('document.id', id),{ lang : lang});
    }).then((function (response) {
      response.results[0]?.data?.body.forEach(prismic => {
        switch (prismic.slice_type) {
          case 'header':
            localStorage.setItem('header', JSON.stringify(prismic));
            this.headerSection = prismic;
            break;

          case 'footer':
            localStorage.setItem('footer', JSON.stringify(prismic));
            this.footerSection = prismic;
            break;
          default:
            console.log("type:", prismic)
        }
      })
    }).bind(this), function (err) {
      console.log("Something went wrong: ", err);
    });
  }
  getPrismicDatas() {
    let ogSection: any;
    let seoSection: any;
    let twitterSection: any;
    let id = this.constant['homeNewId']
    let lang = this.langkey
    return Prismic.api(this.apiUrl).then(function (api) {
      return api.query(Prismic.Predicates.at('document.id', id),{ lang : lang});
    }).then((function (response) {
      console.log(response?.results[0])
      if(response?.results[0]?.data?.page_title){
        this.pageTitle = response?.results[0]?.data?.page_title
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
          case 'slidersection':
            for (let index in prismic.items) {
              prismic.items[index].content3 = prismic.items[index].content3.toLowerCase();
            }
            this.sliderSection = prismic;
            this.sliderSection.items[0].bannerimage.url = "url(" + this.sliderSection.items[0].bannerimage.url + ")";
            break;
          case 'sports_icon':
            this.sportsIcon = prismic;
            break;
          case 'video_section_1':
            this.videoSection1 = prismic;
            break;
          case 'product_section':
            this.productSection = prismic;
            break;
          case 'creative_section':
            this.creativeSection = prismic;
            break;
          case 'mma_events':
            this.mmaEvents = prismic;
            break;
          case 'motorcycle_sports_section':
            this.motorcycleSportsSection = prismic;
            break;
          case 'video2section':
            this.video2Section = prismic;
            break;
          case 'folkssection':
            this.folksSection = prismic;
            break;
          case 'blogsection':
            this.blogSection = prismic;
            break;
          case 'testimonialsection':
            this.testimonialSection = prismic;
            break;
          case 'social_proof_section':
            this.socialProofSection = prismic;
            break;
          default:
            // console.log("type: HOME", prismic)
        }
      })
       this.commonMtd.addMetaTag(seoSection, ogSection, twitterSection);
      this.blogPrimary = this.blogSection?.primary;
      this.getBlogData();
    }).bind(this), function (err) {
      console.log("Something went wrong: ", err);
    });

  }

  articleDatas;
  async getBlogData() {
    let blogData = await this.commonMtd.getBlogPost();
    blogData.recentPosts.forEach((element  )=> {
      let url  = element['data'].image.url.substring(0, element['data'].image.url.indexOf('?'));
      url = url+"?auto=compress,format&w=513&h=344"; //513 X 344 &w=410&h=275
      element['data'].image.url=url;
    });
    this.blogSection = { primary: this.blogPrimary, items: blogData.recentPosts };
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  socialShare(media) {
    switch (media) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${environment.uiUrl}`);
        break;
      case 'instagram':
        window.open(`https://www.instagram.com/9mmenergydrink1/`);
        break;
      case 'youtube':
        window.open(`https://www.youtube.com/`);
        break;
      default:
        break;
    }
  }

  onClickBlog(article){
    let catpost = [];
    this.blogSection?.items.forEach(item=>{
      catpost =this.articleDatas?.items.filter((a) => (a.category==article.category));
    })
    if (catpost?.length > 1) {
      catpost.sort((a, b) => ((a.post_date) > (b.post_date) ? -1 : 1));
      let cpost = [];
      for (let i = 1; i < 4; i++) {
        cpost.push(catpost[i]);
      }
      localStorage.setItem('homePost', JSON.stringify(catpost))
    }else{
      localStorage.setItem('homePost', null)
    }
    this.commonMtd.goToInner('blog', article);
  }

  //added for product section
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
    title = title ? title.replace(/ /g, "-") : "";
    this.router.navigate([this.commonMtd.getRoutePath('shop'), title.toLowerCase()], { queryParams: { code: data.id,key:data.variants[0].sku?.toLowerCase()}});
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
  }

  ngOnDestroy(){
    this.modalService.dismissAll();
  }
}