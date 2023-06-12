import { AfterViewInit, Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Prismic from 'prismic-javascript';
import { Subscription } from 'rxjs';
import { CommonMethods } from 'src/app/common/common-methods';
import { ApiService } from 'src/app/services/api.service';
//import { environment } from 'src/environments/environment.prod';
import { environment } from 'src/environments/environment';
import { CommonMethodsService } from 'src/app/shared/common-methods/common-methods.service';
import { DatePipe, DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
declare let $: any;

@Component({
  selector: 'app-blog-inner',
  templateUrl: './blog-inner.component.html',
  styleUrls: ['./blog-inner.component.css']
})
export class BlogInnerComponent implements OnInit{
  pageTitle = "";
  common: CommonMethods;
  show: boolean;
  articleMsg: string;
  headerSection: any;
  footerSection: any;
  seoSection;
  ogSection;
  bannerSection: any;
  recentPosts: any = [];
  categorySection: any;
  tagSection: any;
  instagramSection: any;
  articleSection: any;
  contentSection: any;
  otherPostSection;
  profileSection;
  commentSection;
  cartCount;// = JSON.parse(localStorage.getItem('cartCount'));
  contentTitle: any;
  contentItem: any;
  ngForm: FormGroup;
  private subScription: Subscription;
  submitted: boolean = false;
  files: File;
  fileName: string;
  commentItem = [];
  pageId = '/blog';
  url: string;
  tag: string;
  category: string;
  categoryPost = [];
  homePost: { items: any; };
  constant: any;
  langkey: any;
  apiUrl: any;
  sideBarSection: any;
  shareSection: any;
  selectedVideoIndex = -1;
  constructor(public translate: TranslateService,private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder,
    private apiService: ApiService, private toastr: ToastrService, private datepipe: DatePipe,
    public commonMtd: CommonMethodsService, private _renderer2: Renderer2, @Inject(DOCUMENT) private _document: Document) {
      this.cartCount = commonMtd.getCartCountDetails();
      this.contentTitle = this.route.snapshot.params['title'];
      if(this.contentTitle == 'where-does-the-caffeine-in-energy-drinks-come-from' || 
      this.contentTitle == 'how-to-be-cognitively-healthy')
      commonMtd.addIndexMeta(true);
      else
      commonMtd.addIndexMeta(true);
    //this.contentTitle = localStorage.getItem('blog-title');
    /*  this.route.queryParams.subscribe(params => {
       this.contentTitle = params['title'];
       console.log(this.contentTitle)
     }) */
    ////this.contentTitle = this.route.snapshot.params['title'];
   // this.contentTitle = this.contentTitle!=null?this.contentTitle.replaceAll("-", " "):"";
    this.url = window.location.href;
    this.pageId = window.location.href;
    console.log(this.url);
    //this.categorySection = JSON.parse(localStorage.getItem('categorySection'));
   // this.recentPosts = JSON.parse(localStorage.getItem('recentPosts'));

    console.log(this.categoryPost)
  }
  
  get u() {
    return this.ngForm.controls;
  }
  get model() {
    return this.ngForm.get('email') || null
  }

  ngOnInit(): void {
    let domainLanguage = this.commonMtd.getSubDomainLanguage();
    this.constant = domainLanguage.constant;
    this.langkey = domainLanguage.langkey;
    this.apiUrl = domainLanguage.apiUrl;
    let data = localStorage.getItem("isLoadingFirst")
    if(data == 'false')
    return;
    this.getPrismicDatas();
    this.getInstaPost();
    this.ngForm = this.formBuilder.group({
      author: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])],
      body: ['', Validators.required],
      articleName: [''],
      imageUrl: [''],
      last_updated: ['']
    })
  }

  getInstaPost() {
    this.apiService.isLoading.next(true);
    this.subScription = this.apiService.getInstaPost().subscribe((res: any) => {
      if(res?.status== "7400" && res?.value?.data){
        this.instagramSection = res.value.data.splice(0,4);
      }
      this.apiService.isLoading.next(false);
  }, err => {
    this.apiService.isLoading.next(false);
  })
}

interval;

  async getPrismicDatas() {
    let prismic = this.commonMtd.getSubDomainLanguage();
    if (prismic?.apiUrl && prismic?.langkey && prismic?.constant['blogId']) {
    let id = prismic.constant['blogId'];
      let lang = prismic.langkey;
    this.apiService.isLoading.next(true);
    Prismic.api(prismic.apiUrl).then(function (api) {
      return api.query(Prismic.Predicates.at('document.id', id),{ lang : lang});
    }).then((function (response) {
      if (response?.results[0]?.data?.page_title) {
        this.pageTitle = response.results[0].data.page_title
      }
      response.results[0]?.data?.body.forEach(prismic => {         
          switch (prismic.slice_type) {
              case 'blog_side_bar_section':         
              this.sideBarSection =prismic;
            break;
            case 'blog_share_section':
              this.shareSection = prismic;
              break;
            default:
              console.log("website:", prismic)
            break;
          }
        })
      this.apiService.isLoading.next(false);
    }).bind(this), function (err) {
      console.log("Something went wrong: ", err);
      this.commonMtd.isLoading.next(false);
    });
  }
    this.interval =  setInterval(() => {
      let disqus = document.getElementById("disqus_thread");//.childNodes[0]['style']['display'] = 'none';
      if(disqus.childNodes[0] && !disqus.childNodes[0]['src']){
        clearInterval(this.interval);
        disqus.removeChild(disqus.childNodes[0]);
      }
      
      }, 50);
    let blogData = await this.commonMtd.getBlogPost();
    this.contentSection = blogData.contentSection;
    let lContentItem;
    this.contentSection?.forEach(item => {
      if (localStorage.getItem("language") == "fr" && (environment.mainDomain.includes(window.location.origin)
      && item?.data?.en_uid && item.data.en_uid.toLowerCase() === this.contentTitle) || (item?.uid).toLowerCase() === this.contentTitle) {
        lContentItem = item;
      }
    })

if(!lContentItem){
  this.router.navigateByUrl("/**");
  return;
}
this.commonMtd.addMetaTag(lContentItem?.data.seoSection, lContentItem?.data.ogSection, lContentItem?.data.twitterSection, lContentItem?.data?.image?.url);



    this.recentPosts = blogData.recentPosts;      
    this.tagSection = blogData.tagSection;

    let categoryData = await this.commonMtd.getPrismicDatas("blog_category");
      categoryData?.forEach(item => {
        item.list = this.contentSection?.filter((a) => (a.data.category.uid == item.uid));
        item.count = item.list.length;
      })
      this.categorySection = categoryData;

      this.tag = lContentItem?.data.tag;
        if(lContentItem?.data?.category?.uid){
          this.category = lContentItem.data.category.uid;
          let cat = this.categorySection?.find(cat => (lContentItem?.data?.category?.uid == cat.uid));
          lContentItem.data.category.name = cat.data.name;
        }

      console.log(this.contentSection)
     this.setArticleContent(lContentItem);
     this.apiService.isLoading.next(false);
    /*let id = this.constant['bloginner']
    let lang = this.langkey
    return Prismic.api(this.apiUrl).then(function (api) {
      return api.query(Prismic.Predicates.at('document.id', id),{ lang : lang});
    }).then((function (response) {
      if(response?.results[0]?.data?.page_title){
        this.pageTitle = response.results[0].data.page_title
      }
      response.results[0]?.data?.body.forEach(prismic => {
        switch (prismic.slice_type) {
          case 'seo_section':
            console.log("seosection:", prismic);
            this.seoSection = prismic;
            break;
          case 'og_section':
            console.log("ogsection:", prismic);
            this.ogSection = prismic;
            break;
          case 'bannersection':
            console.log("bannersection:", prismic);
            this.bannerSection = prismic;
            break;
          case 'category_section':
            console.log("category_section:", prismic);
            // this.categorySection = prismic;
            break;
          case 'tag_clouds_section':
            console.log("tag_clouds_section:", prismic);
            this.tagSection = prismic;
            break;
          case 'instagram_section':
            console.log("instagram_section:", prismic);
           // this.instagramSection = prismic;
            break;
          case 'post_content_section':
            case 'article_content_section':
            console.log("post_content_section:", prismic);
            this.contentSection = prismic;
            break;
          case 'other_post_section':
            console.log("other_post_section:", prismic);
            this.otherPostSection = prismic;
            break;
          case 'profile_section':
            console.log("profile_section:", prismic);
            this.profileSection = prismic;
            break;
          case 'comment_section':
            console.log("comment_section:", prismic);
            this.commentSection = prismic;
            break;
          default:
            console.log("type:", prismic)
        }       

        this.commentSection?.items?.forEach(item => {
          if (item?.comment?.articleName && (item?.comment?.articleName).toLowerCase() === this.contentTitle) {
            this.commentItem.push(item?.comment);
          }
        })
        console.log(this.commentItem);
      })

      this.interval =    setInterval(() => {
        let disqus = document.getElementById("disqus_thread");//.childNodes[0]['style']['display'] = 'none';
        if(disqus.childNodes[0] && !disqus.childNodes[0]['src']){
          clearInterval(this.interval);
          disqus.removeChild(disqus.childNodes[0]);
        }
        
        }, 250);

      ////
        console.log(this.contentSection)
       this.setArticleContent(this.contentTitle);
      /////
    }).bind(this), function (err) {
      console.log("Something went wrong: ", err);
    });*/
  }

  setArticleContent(lContentItem){
   // let lContentItem:any;
    /*this.contentSection?.forEach(item => {
      if (localStorage.getItem("language") == "fr" && (environment.mainDomain.includes(window.location.origin)
      && item?.data?.en_uid && item.data.en_uid.toLowerCase() === title) || (item?.uid).toLowerCase() === title) {
        lContentItem = item;
        this.tag = item?.data.tag;
        if(item?.data?.category?.uid){
          debugger
          this.category = item.data.category.uid;
          let cat = this.categorySection?.find(cat => (item?.data?.category?.uid == cat.uid));
          lContentItem.data.category.name = cat.data.name;
        }
        this.commonMtd.addMetaTag(item?.data.seoSection, item?.data.ogSection, item?.data.twitterSection);
      }
    })*/
   
    let tContent = [];
    let lIndex;
    lContentItem?.data?.more_contents?.forEach((item,index) => {
      let txt = "";
      let prev = 0;
      if(!item.type.includes("heading")){
        item.isInnerHtml = false;
      if(item?.spans){
      for(let s of item?.spans){
        if(s.type == "strong"){
          item.isInnerHtml = true;
          txt += '<span>' + item.text.substring(prev,s.start);
          txt += "<b>" + item.text.substring(s.start,s.end) + "</b>";
          prev = s.end;
        }else if(s.type == "hyperlink"){
           item.isInnerHtml = true;
          txt += '<span>' + item.text.substring(prev,s.start);
          txt += '<a class="blog-link" href="'+ s.data.url +'" target="_blank">' + item.text.substring(s.start,s.end) + "</a>";
          prev = s.end;
        }
      }
    }
      if(item.isInnerHtml){
       txt += item.text.substring(prev,item.text.length) + '</span>'; 
       item.text = txt;
       if(item.text.includes('\n')){
         item.text = item.text.replace(/\n/g, "<br> &nbsp;&nbsp;&nbsp;");
       }
       
      }
    }

    if(item?.text && item.text.includes('\n') && !item.isInnerHtml){
      item.isInnerHtml = true;
      item.text = item.text.replace(/\n/g, "<br> &nbsp;&nbsp;&nbsp;");
      item.text = '<span>' + item.text + '</span>';
    }
         
     // 

      if(item.type == "list-item" || item.type == "o-list-item"){
        if(!lIndex){
          lIndex = tContent.length;
          item.list = [];
          item.list.push(item);
          tContent.push(item);
        }else{
          tContent[lIndex].list.push(item);
        } 
      }else{
        lIndex = null;
        tContent.push(item);
      }
    })
    lContentItem.more_contents = tContent;

    if (lContentItem?.data?.author_description?.length) {
      lContentItem.data.author_description[0].rawText = lContentItem?.data?.author_description[0]?.text;
      let item = lContentItem.data.author_description[0];
      let txt = "<span>";
      let prev = 0;
      for (let s of item?.spans) {
        if (s.type == "strong") {
          item.isInnerHtml = true;
          txt += item.text.substring(prev, s.start);
          txt += "<b>" + item.text.substring(s.start, s.end) + "</b>";
          prev = s.end;
        } else if (s.type == "hyperlink") {
          item.isInnerHtml = true;
          txt += item.text.substring(prev, s.start);
          txt += '<a class="blog-link" href="' + s.data.url + '" target="_blank">' + item.text.substring(s.start, s.end) + "</a>";
          prev = s.end;
        }
      }

      if(item.isInnerHtml){
        txt += item.text.substring(prev,item.text.length); 
        item.text = txt;
       }else{
        item.text = txt + item.text;
       }
       if(item.text.includes('\n')){
        item.text = item.text.replace(/\n/g, "<br> &nbsp;&nbsp;&nbsp;");
      }
      item.text += "</span>";
      lContentItem.data.author_description.text = item.text;
    }

    this.contentItem = lContentItem;
    this.addSchemaScript();
  /* setTimeout(() => {
    if(this.contentItem?.gif_script && document.getElementById("gifScript")?.innerHTML){
      console.log("true")
      document.getElementById("gifScript").innerHTML = "";
      document.getElementById("gifScript").innerHTML = this.contentItem?.gif_script;
    }
 
    }, 0);*/
   
    console.log("ArtCnt: ", this.contentItem);
  }

  setArticleContent1(title){
    let lContentItem;
    this.contentSection?.items?.forEach(item => {
      if ((environment.mainDomain.includes(window.location.origin) && (item?.en_navlink).toLowerCase() === title)
       || (item?.navlink).toLowerCase() === title) {
        lContentItem = item;
        this.tag = item?.tag;
        this.category = item?.category;
        let categoryPost = [];
        this.homePost = { items: JSON.parse(localStorage.getItem('homePost')) };
        if (this.homePost == null) {
      //    this.categoryPost = { items: JSON.parse(localStorage.getItem('categoryPost')) };
        }
        else {
          this.homePost?.items?.forEach(item => {
            if (item?.category == this.category) {
              categoryPost.push(item);
            }
          })
      //    this.categoryPost = { items:categoryPost}
        }
      }
    })
   
    let tContent = [];
    let lIndex;
    lContentItem?.subcontents?.forEach((item,index) => {
      let txt = "";
      let prev = 0;
      if(!item.type.includes("heading")){
        item.isInnerHtml = false;
      if(item?.spans){
      for(let s of item?.spans){
        if(s.type == "strong"){
          item.isInnerHtml = true;
          txt += '<span>' + item.text.substring(prev,s.start);
          txt += "<b>" + item.text.substring(s.start,s.end) + "</b>";
          prev = s.end;
        }else if(s.type == "hyperlink"){
           item.isInnerHtml = true;
          txt += '<span>' + item.text.substring(prev,s.start);
          txt += '<a class="blog-link" href="'+ s.data.url +'" target="_blank">' + item.text.substring(s.start,s.end) + "</a>";
          prev = s.end;
        }
      }
    }
      if(item.isInnerHtml){
       txt += item.text.substring(prev,item.text.length) + '</span>'; 
       item.text = txt;
       if(item.text.includes('\n')){
         item.text = item.text.replace(/\n/g, "<br> &nbsp;&nbsp;&nbsp;");
       }
       
      }
    }

    if(item?.text && item.text.includes('\n') && !item.isInnerHtml){
      item.isInnerHtml = true;
      item.text = item.text.replace(/\n/g, "<br> &nbsp;&nbsp;&nbsp;");
      item.text = '<span>' + item.text + '</span>';
    }
         
     // 

      if(item.type == "list-item" || item.type == "o-list-item"){
        if(!lIndex){
          lIndex = tContent.length;
          item.list = [];
          item.list.push(item);
          tContent.push(item);
        }else{
          tContent[lIndex].list.push(item);
        } 
      }else{
        lIndex = null;
        tContent.push(item);
      }
    })
    lContentItem.subcontents = tContent;

    if (lContentItem?.data?.author_description?.length) {
      let item = lContentItem.data.author_description[0];
      let txt = "<span>";
      let prev = 0;
      for (let s of item?.spans) {
        if (s.type == "strong") {
          item.isInnerHtml = true;
          txt += item.text.substring(prev, s.start);
          txt += "<b>" + item.text.substring(s.start, s.end) + "</b>";
          prev = s.end;
        } else if (s.type == "hyperlink") {
          item.isInnerHtml = true;
          txt += item.text.substring(prev, s.start);
          txt += '<a class="blog-link" href="' + s.data.url + '" target="_blank">' + item.text.substring(s.start, s.end) + "</a>";
          prev = s.end;
        }
      }

      if(item.isInnerHtml){
        txt += item.text.substring(prev,item.text.length); 
        item.text = txt;
       }else{
        item.text = txt + item.text;
       }
       if(item.text.includes('\n')){
        item.text = item.text.replace(/\n/g, "<br> &nbsp;&nbsp;&nbsp;");
      }
      item.text += "</span>";
      lContentItem.data.author_description[0].text = item.text;
    }

    this.contentItem = lContentItem;
    this.addSchemaScript();
   setTimeout(() => {
    if(this.contentItem?.gif_script && document.getElementById("gifScript")?.innerHTML){
      console.log("true")
      document.getElementById("gifScript").innerHTML = "";
      document.getElementById("gifScript").innerHTML = this.contentItem?.gif_script;
    }
 
    }, 0);
   
    console.log("ArtCnt: ", this.contentItem);
  }

  ImgCompress() {
    this.apiService.compressImg(this.files).then(data => {
      this.files = data;
      this.ImagefileUploadService();
    }, catchError => {

    })
  }
  ImagefileUploadService() {
    this.subScription = this.apiService.fileUpload(`Customer/uploadFile`, this.files).subscribe((res: any) => {
      if (res.status = "7400") {
        this.toastr.success(this.translate.instant('photoUploaded'), "Save");
        this.fileName = environment.imageUrl + res.fileName;
        console.log(res.fileName, this.ngForm.value.imageUrl, this.fileName);
      }
      else {
        this.toastr.error(this.translate.instant('uploadFailed'), "Error");
      }
    }, err => {

    })
  }
  uploadFile(event) {
    this.files = event.target.files[0];
    this.ImgCompress();
  }
  submitComment() {
    if (this.ngForm.valid) {
      this.submitted = true;
      this.ngForm.value.articleName = this.contentItem?.articletitle;
      this.ngForm.value.last_updated = (Date.parse(new Date().toString())).toString();
      if (this.ngForm.value.imageUrl == '')
        this.ngForm.value.imageUrl = 'https://9mmenergydrink-gallery.s3.us-east-2.amazonaws.com/comment-profile-images/38580sample.png';
      else
        this.ngForm.value.imageUrl = this.fileName;
      console.log(this.ngForm.value);
      this.subScription = this.apiService.addComment(this.ngForm.value).subscribe((res: any) => {
        if (res.status === "7400") {
          this.toastr.success(this.translate.instant('commentPosted'), "Success");
          this.submitted = false;
          this.ngForm.value.imageUrl = '';
          this.ngForm.reset();
        }
        else {
          this.toastr.error(res.message, "Error");
        }
      })
    }
    else return this.toastr.warning(this.translate.instant('enterValidData'));
  }
 
  socialShare(media) {
    // const url = encodeURIComponent(window.location.href);
    switch (media) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${environment.uiUrl}blog/${this.route.snapshot.params['title']}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?source=tweetbutton&url=${environment.uiUrl}blog/${this.route.snapshot.params['title']}`);
        break;
      case 'pinterest':
        window.open(`https://www.pinterest.com/pin/create/button/?url=${environment.uiUrl}blog/${this.route.snapshot.params['title']}&media=${this.contentItem?.data?.image?.url}`);
        break;
      case 'instagram':
        window.open(`https://www.instagram.com/9mmenergydrink1/`);
        // window.open(`https://instagram.com/accounts/login/?text=%20Check%20up%20this%20awesome%20content?url=${environment.uiUrl}blog-inner/${this.contentTitle}`);   
        break;
      default:
        break;
    }
  }
  postDateFormat(post) {
    post.items.forEach(data => {
      let date = this.datepipe.transform(data?.post_date, 'MMMM d, y', 'es-ES');
      data.post_date = date;
    })
    return post;
  }

  getCategoryPost(category) {
    this.category = category.category;
    this.tag = '';
    this.articleSection = {items:[]};
    this.articleSection.items = category.list;
    this.articleSection = Object.assign({}, this.articleSection);
    if (this.articleSection?.items?.length == 0)
      this.articleMsg =  this.translate.instant('noarticle') +this.category+ this.translate.instant('category');
    localStorage.setItem('categoryPost', JSON.stringify(this.articleSection?.items));
  }

  loadingArticle(category, type) {
    console.log('category list more', category);
    if (type == 'more')
      this.show = true;
    else
      this.show = false;
  }
  tagArticle(tag) {
    this.tag = tag;
    let article = this.articleSection;    
    article.items = this.contentSection?.items?.filter(item => item?.tag == tag && this.category == item.category);
    this.articleSection = article;
    if (this.articleSection?.items?.length == 0)
      this.articleMsg = this.translate.instant('noarticle')+this.tag +" " +this.translate.instant('tag');
    console.log(tag, this.articleSection);
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  onClickInstaPost(item){
    if(item?.permalink){
      window.open(item?.permalink);
    }else if(item?.username){
      window.open("https://www.instagram.com/" + item.username + "/");
    }
  }

  addSchemaScript() {
    if(this.contentItem?.data?.author_name?.toLowerCase() == 'nicolas roy'){
      let personSchema = this._renderer2.createElement('script');
      personSchema.type = `application/ld+json`;
      personSchema.text = `{
        "@context": "https://schema.org",
      "@type": "Person",
      "name": "NICOLAS ROY",
      "gender": "Male",
      "image": "https://prismic-io.s3.amazonaws.com/9mmenergydrink/6dd0c1ba-fdde-4ba7-a80d-a8326e5c7dd5_Nicolas-Roy-Temporary-picture.jpg",
      "description": "Nicolas Roy is a kinesiologist specializing in strength and conditioning. He himself is passionate about speed, strength, power, nutrition and much more. Among trying his best to be a great father and husband, his hobbies are jiu-jitsu, strength training, hiking, reading and listening to podcasts.",
      "url": "https://www.amazon.ca/-/fr/Nicolas-Roy/dp/0993979203/ref=sr_1_1?__mk_fr_CA=%C3%85M%C3%85%C5%BD%C3%95%C3%91&keywords=Defying+Gravity+volleyball&qid=1638542381&sr=8-1",
       "subjectOf": {
    "@type": "Book",
    "name": "Defying Gravity: Improve your vertical jump and more for volleyball",
       "url": "https://www.amazon.com/Defying-Gravity-Improve-vertical-volleyball-ebook/dp/B00TP41QS2"
          }
      }`

      this._renderer2.appendChild(this._document.head, personSchema);
    }
    /*schema script*/   
      let schema = this._renderer2.createElement('script');
      schema.type = `application/ld+json`;
      schema.text = `{
        "@context": "https://schema.org/",
        "@type": "Article",
        "author": {
                    "@type": "Person",
                    "name": "${(this.contentItem?.data?.author_name)?this.contentItem.data.author_name:'Admin'}",
                    "url":"${(this.contentItem?.data?.details_link)?this.contentItem.data.details_link:window.location.href}",
	                  "description": "${(this.contentItem?.data?.author_description[0]?.rawText)?(this.contentItem.data.author_description[0].rawText):'Consumers look to drinks to stay healthy.  You’ll find a lot of articles to help you to understand about 9MM Energy Drinks and 9MM powered by NeuroTracker x.'}"
                  },
                  "headline": "${this.contentItem.data.title}",
        "image": {
                    "@type": "ImageObject",
                    "url": "${this.contentItem.data.image.url}"
                  },
        "datePublished": "${this.contentItem.data.postDate}",
        "publisher": {
                        "@type": "Organization",
                        "name": "9MM Beyond Energy",
                        "description": "9mm is a healthy energy drink & cognitive enhancer to help you stay focus to reach your target. Combine it with the neuro tracker system to weaponize your brain!",
                        "logo": {
                                  "@type": "ImageObject",
                                  "url": "https://images.prismic.io/9mmenergydrink/87942abd-257d-4b28-90ee-48b1bcafc36d_9mm-black-beyond-logo.png?auto=compress,format&rect=0,0,200,150&w=200&h=150"
                                },
                        "address": "9350 WILSHIRE BLVD, SUITE 203, BEVERLY HILLS, CA 90212 (P)",
                        "location": "9350 WILSHIRE BLVD, SUITE 203, BEVERLY HILLS, CA 90212 (P)"
                      },

                      "keywords": "${this.contentItem?.data?.tag?(this.contentItem.data.tag + ", "):''
                                    + (this.contentItem?.data?.category?.name)?this.contentItem.data.category.name:''}",
                      "dateModified": "${this.contentItem?.data?.postDate}",
                      "mainEntityOfPage": "${window.location.href}",
                      "description": "${(this.contentItem?.data?.seoSection?.primary?.description)?this.contentItem.data.seoSection.primary.description:''}"

      }`;
      this._renderer2.appendChild(this._document.head, schema);
  }

  gotoCTALink() {
    if (this.contentItem?.data?.cta_link) {
      if (this.contentItem.data.cta_link.includes("http") || this.contentItem.data.cta_link.includes("www.")) {
        window.location.href = this.contentItem.data.cta_link;
      } else {
        this.router.navigate([this.commonMtd.getRoutePath(this.contentItem.data.cta_link)]);
      }
    }
  }
  
  playVideo(index) {
    if (this.selectedVideoIndex > -1 && this.selectedVideoIndex != index)
      this.videoEnded(this.selectedVideoIndex);
    this.selectedVideoIndex = index;
    var video = $('#instaVideoId' + index).get(0);
    if (video.paused) {
      this.commonMtd.showHidePlayPauseBtn(index, true);
      video.play();
    } else {
      this.commonMtd.showHidePlayPauseBtn(index);
      video.pause();
    }
  }

  videoEnded(index) {
    $('#instaVideoId' + index).load();
    this.commonMtd.showHidePlayPauseBtn(index);
  }

}
