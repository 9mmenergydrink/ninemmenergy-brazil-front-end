import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import Prismic from 'prismic-javascript';
import { Subscription } from 'rxjs';
import { CommonMethods } from 'src/app/common/common-methods';
import { ApiService } from 'src/app/services/api.service';
import { CommonMethodsService } from 'src/app/shared/common-methods/common-methods.service';
declare let $: any;


@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  common: CommonMethods;
  articleMsg: string;
  twitterSection: any;  
  pageTitle = "";
  headerSection: any;
  footerSection: any;
  seoSection;
  ogSection;
  private subScription: Subscription;
  bannerSection: any;
  recentPosts: any = [];
  categorySection: any;
  tagSection: any;
  instagramSection: any;
  contentSection: any;
  cartCount;// = JSON.parse(localStorage.getItem('cartCount'));
  articleSection: any;
  category: string;
  tag: string;
  searchTerm;
  page = 1;
  pageSize = 2;
  sideBarSection: any;
  shareSection: any;
  selectedVideoIndex = -1;

  constructor(public translate: TranslateService, private apiService:ApiService, private router: Router, private datepipe: DatePipe,
    private route: ActivatedRoute, private commonMtd:CommonMethodsService) {
      this.cartCount = commonMtd.getCartCountDetails();
      commonMtd.addIndexMeta(true);
    this.common = new CommonMethods(router);
  }

  ngOnInit(): void {
    this.getPrismicDatas();
    this.getInstaPost();
    this.common.clear();
  }

  gotoReadMore(){
    // this.common.navigate('/read-more', "blog");
    this.router.navigate([this.commonMtd.getRoutePath('shop')], { fragment: 'down' });
  }

  async getPrismicDatas() {
    let prismic = this.commonMtd.getSubDomainLanguage();
    if (prismic?.apiUrl && prismic?.langkey && prismic?.constant['blogId']) {
      let id = prismic.constant['blogId'];
      let lang = prismic.langkey;
      let categoryData;
      Prismic.api(prismic.apiUrl).then(function (api) {
        return api.query(Prismic.Predicates.at('document.id', id), { lang: lang });
      }).then((function (response) {
        if (response?.results[0]?.data?.page_title) {
          this.pageTitle = response.results[0].data.page_title
        }
        response.results[0]?.data?.body.forEach(prismic => {
          switch (prismic.slice_type) {
            case 'seo_section':
              this.seoSection = prismic;
              break;
            case 'og_section':
              this.ogSection = prismic;
              break;
            case 'twitter_section':
              this.twitterSection = prismic;
              break;
            case 'banner_section':
              this.bannerSection = prismic;
              break;
              case 'blog_side_bar_section':               
              this.sideBarSection =prismic;
            break;
            case 'blog_share_section':              

              this.shareSection = prismic;
              break;
            default:
              console.log("type:", prismic)
          }
        })

        this.commonMtd.addMetaTag(this.seoSection, this.ogSection, this.twitterSection);

        //this.contentSection.sort((a, b) => ((a.category) > (b.category) ? -1 : 1));
        /*  this.postDateFormat(this.contentSection);  
          this.contentSection?.items.sort((a, b) => ((a.post_date) > (b.post_date) ? -1 : 1));  
          
              //   
            categoryData?.items?.forEach(item => {
              item.list = this.contentSection?.items.filter((a) => (a.category==item.category));
              item.count = item.list.length;
            })
            this.categorySection = categoryData;
            let larticleSection = Object.assign({},this.contentSection);
            larticleSection.items = this.categorySection.items[0].list;
            this.articleSection = larticleSection;
            //this.category = this.articleSection?.items[0]?.category;
            
            // if (this.articleSection?.items?.length == 0)
            //   this.articleMsg = `There is no article found for ${this.category} Category`;
            localStorage.setItem('categorySection', JSON.stringify(this.categorySection));
            
            if(this.contentSection?.items.length > 4){
              this.recentPosts = this.contentSection?.items.slice(0,4);
            }else{
              this.recentPosts = this.contentSection?.items;
            }
            console.log("recent posts ", this.recentPosts);
            
            let catpost = [];
            localStorage.setItem('homePost', null);
            if (this.articleSection?.items?.length > 1) {
      
              catpost.push(...this.articleSection?.items)
              catpost.sort((a, b) => ((a.post_date) > (b.post_date) ? -1 : 1));
              let cpost = [];
              for (let i = 1; i < 4; i++) {
                cpost.push(catpost[i]);
              }
              localStorage.setItem('categoryPost', JSON.stringify(cpost));
            }
            else localStorage.setItem('categoryPost', JSON.stringify(catpost))
            localStorage.setItem('recentPosts', JSON.stringify(this.recentPosts));*/
      }).bind(this), function (err) {
        console.log("Something went wrong: ", err);
      });
      debugger
      let blogData = await this.commonMtd.getBlogPost();
      let tempContentSection = JSON.parse(JSON.stringify(blogData.contentSection))
      tempContentSection.splice(0,1);
      this.contentSection = JSON.parse(JSON.stringify(tempContentSection));
      this.recentPosts = blogData.recentPosts;
      this.tagSection = blogData.tagSection;

      categoryData = await this.commonMtd.getPrismicDatas("blog_category");
      categoryData?.forEach(item => {
        item.list = blogData?.contentSection?.filter((a) => (a.data.category.uid == item.uid));
        item.count = item.list.length;
      })
      this.categorySection = categoryData;
    }
  }

  getCategoryPost(category) {
    this.tag = '';
    /*this.articleSection.items = category.list;
    this.articleSection = Object.assign({}, this.articleSection);
    if (this.articleSection?.items?.length == 0)
      this.articleMsg = `There is no article found for ${this.category} Category`;
    console.log("article", this.articleSection);
    localStorage.setItem('categoryPost', JSON.stringify(this.articleSection?.items));*/

    this.commonMtd.goToInner('category', category);
   // this.router.navigate([this.commonMtd.getRoutePath('category'), category.category]);
   /* let catpost = [];
    if (this.articleSection?.items?.length > 1) {

      catpost.push(...this.articleSection?.items)
      catpost.sort((a, b) => ((a.post_date) > (b.post_date) ? -1 : 1));
      let cpost = [];
      for (let i = 1; i < 4; i++) {
        cpost.push(catpost[i]);
      }
      localStorage.setItem('categoryPost', JSON.stringify(cpost));
    }
    else localStorage.setItem('categoryPost', JSON.stringify(catpost))*/
  }

  tagArticle(tag) {
    this.tag = tag;
    let article = this.articleSection;    
    article.items = this.contentSection?.items?.filter(item => item?.tag == tag && this.category == item.category);
    this.articleSection = article;
    if (this.articleSection?.items?.length == 0)
      this.articleMsg = this.translate.instant('noarticle')+" "+this.tag+" "+this.translate.instant('tag');
    console.log(tag, this.articleSection);
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  getInstaPost() {
    this.subScription = this.apiService.getInstaPost().subscribe((res: any) => {
      console.log('getInstaPost', res);
      if(res?.status== "7400" && res?.value?.data){
        this.instagramSection = res.value.data.splice(0,4);
      }
      
  }, err => {
    this.apiService.isLoading.next(false);
  })
    //let openedWindow = window.open('https://api.instagram.com/oauth/authorize?client_id=3979755122071499&redirect_uri=https://oceanwp.org/instagram/&scope=user_profile,user_media&response_type=code');
    //console.log(openedWindow.location.href);
    
    //this.service.getInstaData().subscribe((res: any) => {
    /*  let access_token = this.route.snapshot.params['code'];
     console.log(access_token) */
    /*  let myHeaders = new Headers();
     myHeaders.append('User-Agent', 'Mozilla');
      let requestOptions: RequestInit = {
        method: 'GET',
        redirect: 'follow',
        headers: myHeaders,
        mode: 'cors'
      };
      fetch(`https://www.instagram.com/9mmenergydrink1/?__a=1`, requestOptions)
        .then(response => response.text())
        .then(result => {
          console.log(result)
        })
        .catch(error => {
          console.log('error', error);
        }) */
     /*  }, err => {

       }) */ 

  }

  onClickBlog(item){
    this.commonMtd.goToInner('blog', item);
   // title = title?title.replaceAll(" ","-"):"";
    //title = title.toLowerCase();
   // this.router.navigate([this.commonMtd.getRoutePath('blog'), title]);
  }

  onClickInstaPost(item){
    if(item?.permalink){
      window.open(item?.permalink);
    }else if(item?.username){
      window.open("https://www.instagram.com/" + item.username + "/");
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