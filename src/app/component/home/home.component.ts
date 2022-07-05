import { Component, OnInit, TemplateRef, ViewChild, Renderer2, Inject } from '@angular/core';
import Prismic from 'prismic-javascript';
import "@lottiefiles/lottie-player";
import { CommonMethods } from 'src/app/common/common-methods';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { prismicEnConstants, prismicMmaEnConstants } from 'src/app/common/prismic-Enconstants';
import { prismicFrConstants } from 'src/app/common/prismic-Frconstants';
import { VideoPopupComponent } from 'src/app/shared/popup/video-popup/video-popup.component';
import { CommonMethodsService } from 'src/app/shared/common-methods/common-methods.service';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild("content") modalContent: TemplateRef<any>;
  pageTitle = "";
  headerSection: any;
  footerSection: any;
  sliderSection: any;
  videoSection: any;
  video2Section: any;
  folksSection: any;
  worksSection: any;
  blogSection: any;
  testimonialSection: any;
  newsletterSection: any;
  socialProofSection: any;
  cartCount;// = JSON.parse(localStorage.getItem('cartCount'));
  common;

  hide: boolean = true;
  show: boolean = false;
  hide1: boolean = true;
  show1: boolean = false;
  hide2: boolean = true;
  show2: boolean = false;
  hide3: boolean = true;
  show3: boolean = false;
  items = [];
  ngForm: FormGroup;
  artPost: any;
  culturePost: any;
  designPost: any;
  productionPost: any;
  managementPost: any;
  illustrationPost: any;
  blogPrimary: any;
  categorySection: any;
  language: any;
  constant: any;
  langkey: any;
  apiUrl: any;
  private subScription: Subscription;
  constructor(public translate: TranslateService, private datepipe: DatePipe, private modalService: NgbModal, private formBuilder: FormBuilder,
    private toastr: ToastrService, private service: ApiService, private router: Router,
    private commonMtd:CommonMethodsService, private _renderer2: Renderer2, 
    @Inject(DOCUMENT) private _document: Document) {
      this.cartCount = commonMtd.getCartCountDetails();
      commonMtd.addIndexMeta(true);      
    this.common = new CommonMethods(router);
  }

  ngOnInit(): void {
    let domainLanguage = this.commonMtd.getSubDomainLanguage();
    this.constant = domainLanguage.constant;
    this.langkey = domainLanguage.langkey;
    this.apiUrl = domainLanguage.apiUrl;

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

  gotoReadMore(slide){
    // this.common.navigate('/read-more', slide);
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
    let id = this.constant['homeDataId']
    let lang = this.langkey
    return Prismic.api(this.apiUrl).then(function (api) {
      return api.query(Prismic.Predicates.at('document.id', id),{ lang : lang});
     //return api.query(Prismic.Predicates.at('document.uid', 'home'),{ lang : 'en-us' });
    }).then((function (response) {
      console.log(response?.results[0])
      if(response?.results[0]?.data?.page_title){
        this.pageTitle = response.results[0].data.page_title
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
          case 'videosection':
            this.videoSection = prismic;
            break;
          case 'video1section': // for MMA
            this.videoSection = prismic;
            break;
          case 'video2section':
            this.video2Section = prismic;
            //this.video2Section.primary.image.url = "url("+this.video2Section.primary.image.url+")";
            break;
          case 'folkssection':
            this.folksSection = prismic;
            break;
          case 'workssection':
            this.worksSection = prismic;
            break;
          case 'blogsection':
            this.blogSection = prismic;
            break;
          case 'testimonialsection':
            this.testimonialSection = prismic;
            break;
          case 'news_letter_section':
            this.newsletterSection = prismic;
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
     // this.openNewsLetter();

     /* let content;
      this.worksSection?.items?.forEach(item => {
        content = item?.content;//?.substring(0, 304);
        if (item?.content?.length > 304) {
          item.show = false;
        }
        else {
          item.show = false;
        }
        this.items.push(content);
      })*/
      setTimeout(() => {
        this.worksSection?.items?.forEach((item,i) => {
          // 20px for read more button margin top, and 20px for adjustment
          let bh = document.getElementById("wb" + (i+1))['offsetHeight'] + 40;
          let th = document.getElementById("wi" + (i+1))['offsetHeight'];
          if (th < document.getElementById("wc" + (i+1))['offsetHeight']) {
            item.show = true;
            item.isRead = false;
          }
          else {
            item.show = false;
            item.isRead = true;
          }
          item.height = (th-bh-6) + 'px';
        })
      }, 1750);

      
      this.worksSection = JSON.parse(JSON.stringify(this.worksSection));
      
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
   /* let id = this.constant['blogId']
    let lang = this.langkey
    return Prismic.api(this.apiUrl).then(function (api) {
      return api.query(Prismic.Predicates.at('document.id', id),{ lang : lang});
    }).then((function (response) {
      response.results[0]?.data?.body.forEach(prismic => {
        switch (prismic.slice_type) {
          case 'category_section':
            this.categorySection = prismic;
            break;
          case 'article_section':
            this.articleDatas = prismic;
            break;
          default:
            // console.log("type:", prismic)
        }
      })

      this.articleDatas?.items.sort((a, b) => ((a.post_date) > (b.post_date) ? -1 : 1));  
      this.postDateFormat(this.articleDatas);
        //   
      this.categorySection?.items?.forEach(item => {
        item.list = this.articleDatas?.items.filter((a) => (a.category==item.category));
        item.count = item.list.length;
      })

     
      localStorage.setItem('categorySection', JSON.stringify(this.categorySection));     
      let recentPosts = [];
      if(this.articleDatas?.items.length > 3){
        recentPosts = this.articleDatas.items.slice(0,3);
      }else{
        recentPosts = this.articleDatas.items;
      }
      localStorage.setItem('recentPosts', JSON.stringify(recentPosts));
      this.blogSection = { primary: this.blogPrimary, items: recentPosts };
    //  localStorage.setItem('recentPosts', JSON.stringify(this.blogSection));
      console.log("bData:",this.blogSection);
    }).bind(this), function (err) {
      console.log("Something went wrong: ", err);
    });*/

  }
  // openNewsLetter() {
  //   setTimeout(() => {
  //     this.modalService.open(this.modalContent, { centered: true, windowClass: 'subs-popup'});
  //   }, 1750);
  // }

  subscribe() {
    console.log(this.ngForm.value);
    if (this.ngForm.valid) {
      this.subScription = this.service.subscribeNewsletter(this.ngForm.value.email).subscribe((res: any) => {
        console.log(res);
        if (res.status === "7400") {
          this.toastr.success(this.translate.instant('newsletterSubscribed'));
          this.modalService.dismissAll();
        }
        else {
          this.toastr.error(res.message, this.translate.instant('error'));
        }
      }, err => {

      })
    }
    else this.toastr.warning(this.translate.instant('pleaseEnterValidEmailAddress'));
  }

 onClickRead(i){
   if(this.worksSection?.items[i]?.isRead != null ){
    return this.worksSection.items[i].isRead = !this.worksSection.items[i].isRead;
  }else{
    return false;
  }
}
  
  readMore(item) {
    if (item == '0') {
      this.show = true;
      this.hide = false;
    }
    if (item == '1') {
      this.show1 = true;
      this.hide1 = false;
    }
    if (item == '2') {
      this.show2 = true;
      this.hide2 = false;
    }
    if (item == '3') {
      this.show3 = true;
      this.hide3 = false;
    }
  }
  readLess(item) {
    if (item == '0') {
      this.show = false;
      this.hide = true;
    }
    if (item == '1') {
      this.show1 = false;
      this.hide1 = true;
    }
    if (item == '2') {
      this.show2 = false;
      this.hide2 = true;
    }
    if (item == '3') {
      this.show3 = false;
      this.hide3 = true;
    }
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  socialShare(media) {
    // const url = encodeURIComponent(window.location.href);
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
  getBlogPage(item) {
    let catpost = [];
    switch (item?.category) {
      case 'Brain Training':
        catpost.push(this.artPost?.items);
        break;
      case 'News':
        catpost.push(this.culturePost?.items);
        break;
      case 'DESIGN':
        catpost.push(this.designPost?.items);
        break;
      case 'PRODUCTION':
        catpost.push(this.productionPost?.items);
        break;
      case 'Nutraceuticals':
        catpost.push(this.managementPost?.items);
        break;
      case 'ILLUSTRATION':
        catpost.push(this.illustrationPost?.items);
        break;
      default:
        console.log("type:", item?.category, item);
    }
    if (catpost?.length > 1) {
      catpost.sort((a, b) => ((a.post_date) > (b.post_date) ? -1 : 1));
      let cpost = [];
      for (let i = 1; i < 4; i++) {
        cpost.push(catpost[i]);
      }
      localStorage.setItem('categoryPost', JSON.stringify(catpost))
    }
    else localStorage.setItem('categoryPost', JSON.stringify(catpost))

    let title = item?.title?item.title.replaceAll(" ","_"):"";
    title = title.toLowerCase();
    this.common.navigateTitle(this.commonMtd.getRoutePath('blog'),title);
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
    
   // article.navlink = article.navlink?article.navlink.replaceAll(" ","-"):"";
   // this.router.navigate([this.commonMtd.getRoutePath('blog'), article.navlink.toLowerCase()]);
    this.commonMtd.goToInner('blog', article);
  }
}
