import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonMethodsService } from 'src/app/shared/common-methods/common-methods.service';
import Prismic from 'prismic-javascript';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-category-blog',
  templateUrl: './category-blog.component.html',
  styleUrls: ['./category-blog.component.css']
})
export class CategoryBlogComponent implements OnInit {
  categoryPost = [];
  headerSection: any;
  footerSection: any;
  cartCount;
  categoryInfo;// = JSON.parse(localStorage.getItem('cartCount'));
  constructor(private router: Router, public commonMtd: CommonMethodsService, private route: ActivatedRoute,
    private apiService:ApiService) { 
    this.cartCount = commonMtd.getCartCountDetails();
    commonMtd.addIndexMeta();
   // this.categoryPost = JSON.parse(localStorage.getItem('categoryPost'));
    // console.log("categoryPost:", this.categoryPost);
  }

  ngOnInit(): void {
    let title = this.route.snapshot.params['title'];
    if(title){ 
      //title = title!=null?title.replaceAll("-", " "):"";
      this.apiService.isLoading.next(true);
      let data = localStorage.getItem("isLoadingFirst")
      if(data == 'false')
      return;
      this.getPrismicDatas(title);
      this.apiService.isLoading.next(false);
    }
  }

  
  async getPrismicDatas(title){

    let blogData = await this.commonMtd.getBlogPost();
    let articleData = blogData.contentSection;
    let categoryList = await this.commonMtd.getPrismicDatas("blog_category");
    console.log(categoryList);
    let lCategoryPost = [];
      for(let cat of categoryList){       
        
        if((environment.mainDomain.includes(window.location.origin) && cat?.data?.en_uid?.toLowerCase() == title.toLowerCase())
        || cat?.uid?.toLowerCase() == title.toLowerCase()){
        
          this.categoryInfo = cat;
         articleData.forEach(item => {
          if(item?.data?.category?.id == cat?.id){
          
          console.log("categoryPost:",item)
          lCategoryPost.push(item);
        }
      })  
        }
      }
      if(!this.categoryInfo){
        this.router.navigateByUrl("/**");
      }
    this.categoryPost = lCategoryPost;


    let ogSection: any;
    let seoSection: any;
    let twitterSection: any;
    let categoryData = this.categoryInfo['data'];
    console.log(categoryData);
    //Adding SEO to blog category
    for (let obj in categoryData) {
      console.log(obj);
      if (obj != null && obj.indexOf('body') > -1 && !Number.isNaN(obj.replace("body", ""))) {
        let prismic = categoryData[obj]?.length > 0
          ? categoryData[obj][0]
          : null;
        switch (prismic.slice_type) {
          case 'seo_section':
                  seoSection = prismic;
                  break;

                case 'og_section':
                  ogSection = prismic;             
                  break;

                case 'twitter_section':
                  twitterSection = prismic;          
                  break;

                default:
        }
      }
    }
           this.commonMtd.addMetaTag(seoSection, ogSection, twitterSection);
  /*  let domainLang = this.commonMtd.getSubDomainLanguage();
    let categoryData, articleData;
    return Prismic.api(domainLang.apiUrl).then(function (api) {
      return api.query(Prismic.Predicates.at('document.id', domainLang.constant['blogId']),{ lang : domainLang.langkey});
    }).then((function (response) {
      if(response?.results[0]?.data?.page_title){
        this.pageTitle = response.results[0].data.page_title
      }
      response.results[0]?.data?.body.forEach(prismic => {
        switch(prismic.slice_type){
            case 'seo_section':
              this.seoSection = prismic;
              break;
            case 'og_section':
            this.ogSection = prismic;
            break;
            case 'category_section':
              console.log("category_section:", prismic);
              categoryData = prismic;
              break;
          case 'article_section':     
          articleData = prismic;            
              break;
         default:
             // console.log("type:",prismic)
        }
      })

      let lCategoryPost = [];
      for(let cat of categoryData.items){
        if((environment.mainDomain.includes(window.location.origin) && cat?.en_navlink.toLowerCase() == title.toLowerCase())
        || cat?.navlink.toLowerCase() == title.toLowerCase())
        articleData.items.forEach(item => {
          if(item.category == cat.category){
          console.log("categoryPost:",item)
          lCategoryPost.push(item);
        }
      })
      }

      this.categoryPost = lCategoryPost;

    }).bind(this), function (err) {
      console.log("Something went wrong: ", err);
    });   */

  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

 /* onClickBlog(title){
    title = title?title.replaceAll(" ","-"):"";
    title = title.toLowerCase();
    this.router.navigate([this.commonMtd.getRoutePath('blog'), title]);
  }*/

 }
