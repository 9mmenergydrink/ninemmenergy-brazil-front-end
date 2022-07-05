import { Component, Input, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Prismic from 'prismic-javascript';
import {TranslateService} from '@ngx-translate/core';
import { CommonMethods } from 'src/app/common/common-methods';
import { environment } from 'src/environments/environment';
import { prismicEnConstants, prismicMmaEnConstants } from 'src/app/common/prismic-Enconstants';
import { prismicFrConstants } from 'src/app/common/prismic-Frconstants';
import { CommonMethodsService } from 'src/app/shared/common-methods/common-methods.service';
import { ApiService } from 'src/app/services/api.service';
declare let $:any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isShowUserMenu = false;
  userName = "";
  userShortName = "";
  header: any;
  menu;
  menus=[];
  isShowLang: boolean = false;
  language: any;
  constant: any;
  langkey: any;
  apiUrl: any;
  subMenu: boolean = false;
  currentURL:any;
  common;
  previousIndex;
  @Input() set headerSection(val: any) {

    this.menu = localStorage.getItem('menu');
    /*if (val != null) {
      this.header = val;
      console.log("val", val)
    }
    else {
      this.header = JSON.parse(localStorage.getItem('header'));
      if(this.header==null || this.header ==''){
        this.getHeaderFooterDatas();
      }
    }*/
    let domainLanguage = this.commonMtd.getSubDomainLanguage();
    this.constant = domainLanguage.constant;
    this.langkey = domainLanguage.langkey;
    this.apiUrl = domainLanguage.apiUrl;
    this.getHeaderFooterDatas();
  }

  cCount = 0;
  @Input() set cartCount(val: any) {
    if (val?.qCount != null) {
      this.cCount = val.qCount;
    }

    let profile = JSON.parse(localStorage.getItem("profile"));
    if(profile){
      this.userName = profile.name;
      this.userShortName = profile.shortName;
    }
    
    this.isShowUserMenu = JSON.parse(localStorage.getItem('showUserMenu'));
  }  

  constructor(public router: Router, public translate: TranslateService, public commonMtd: CommonMethodsService, private route: ActivatedRoute,
    private apiService:ApiService) { 
    translate.use(localStorage.getItem('language'));
    this.common = new CommonMethods(router);
    this.apiService.cartCount.subscribe((v) => {
			this.cCount = v;
		});
    this.apiService.userShortName.subscribe((v) => {
			this.userShortName = v;
		});
  }

  ngOnInit(): void {
    if(localStorage.getItem('language') == null || localStorage.getItem('language') == undefined || localStorage.getItem('language') == ''){
      localStorage.setItem('language', 'en');
    }
    this.language = localStorage.getItem('language');
    this.currentURL = window.location.origin;
    if(environment.mainDomain.indexOf(this.currentURL) >= 0 || environment.europeDomain.indexOf(this.currentURL) >= 0) {
      this.subMenu = true;
    }
  }

  selectLan(val){
    this.isShowLang == true?this.isShowLang = false: this.isShowLang = true; 
    let urlPath = this.route.snapshot.routeConfig.path;
    let paramTitle = this.route.snapshot.params["title"]; 
    let menuName = this.commonMtd.getKeyByValue(null, "/" + urlPath);
    localStorage.setItem('language', val);
    
    menuName = this.commonMtd.getRoutePath(menuName, val, true);

    let origin = window.location.origin;
    if(val == "en"){
      if(environment.mmaFRDomain.includes(origin)){
        window.location.href = environment.mmaDomain + menuName.substring(1,menuName.length);
        return;
      }else if(environment.esportsFRDomain.includes(origin)){
        window.location.href = environment.esportsDomain + menuName.substring(1,menuName.length);
        return;
      }else if(environment.motorFRDomain.includes(origin)){
        window.location.href = environment.motorDomain + menuName.substring(1,menuName.length);
        return;
      }
    }else{
      if(environment.mmaDomain.includes(origin)){
        window.location.href = environment.mmaFRDomain + menuName.substring(1,menuName.length);
        return;
      }else if(environment.esportsDomain.includes(origin)){
        window.location.href = environment.esportsFRDomain + menuName.substring(1,menuName.length);
        return;
      }else if(environment.motorDomain.includes(origin)){
        window.location.href = environment.motorFRDomain + menuName.substring(1,menuName.length);
        return;
      }
    }

    if(paramTitle) {
      this.common.navigate(menuName, paramTitle.toLowerCase());
    } else if(this.router.url.indexOf("#") > -1) {
        this.router.navigate([menuName], { fragment: 'down' });
    } else {
      this.common.navigate(menuName);
    }
     //this.translate.use(val);
    if(!menuName.includes("/fr") && !menuName.includes("/en"))
    location.reload();
  }

  onClickuser(){
    //if(!this.isShowUserMenu)
    //  this.onClick('/login');
  }

  showlang(){
    this.isShowLang == true?this.isShowLang = false: this.isShowLang = true;
  }

  onClick(menuname, isNavigate?,item?) {
    if(item)
    item.isOpenSubMenu=false;

    menuname = menuname.replace(/ /g, "");
    menuname = menuname.toLowerCase();
    localStorage.setItem('menu', menuname);
    let name = "/";
   
    name = this.commonMtd.getRoutePath(menuname, this.language);

    if (isNavigate || this.router.url != name) {
      this.router.navigate([name])
        .then(() => {
     //     window.location.reload();
        });
    }
  }

  onClickLogOut(){  
    this.isShowUserMenu = false;
    this.common.clearAccountInformation();
    this.router.navigate([this.commonMtd.getRoutePath('home')]);
  }

  @HostListener('document:scroll', ['$event'])
  scrollHandler(event) {
    var nav = document.querySelector(".navbar-fixed-top");
    if (window.pageYOffset > nav['offsetHeight']) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  getHeaderFooterDatas(){
    let id = this.constant['headerId']
    let lang = this.langkey
    let subMenus;
    return Prismic.api(this.apiUrl).then(function (api) {
     // return api.query(Prismic.Predicates.at('document.id', 'YJ5rahEAAGb8SCfY'));
     return api.query(Prismic.Predicates.at('document.id', id),{ lang : lang});
    }).then((function (response) {
      
      response.results[0]?.data?.body.forEach(prismic => {
        switch(prismic.slice_type){
          case 'header':
            localStorage.setItem('header', JSON.stringify(prismic));
            this.header = prismic;
            break;
          case 'header_section':
            localStorage.setItem('header', JSON.stringify(prismic));
            this.header = prismic;
            break;
          case 'sub_menus':
            subMenus = prismic;
            break;
          case 'footer':
            localStorage.setItem('footer', JSON.stringify(prismic));
            this.footerSection = prismic;
            break;
          default:
            console.log("type:",prismic)
        }
      })
      let menus=[];
      this.header?.items.forEach(menu => {
        let lSubMenus=subMenus?.items.filter(subMenu=>subMenu?.parent_menuname==menu?.menuname);
        menu.subMenus=[];
        menu.isOpenSubMenu = true;
        if (lSubMenus?.length) {
          menu.subMenus.push(...lSubMenus);
        }
        menus.push(menu)
      });
      this.menus=menus;
      //this.hoverDropdown();
    }).bind(this), function (err) {
      console.log("Something went wrong: ", err);
    });
  }

  hoverDropdown(){
    $('.dropdown').hover(function () {
            $(this).find('.dropdown-menu').first().stop(true, true).slideDown(150);
        }, function () {
            $(this).find('.dropdown-menu').first().stop(true, true).slideUp(105)
        });
  }
  
  onToggle(item, index) {
    item.isOpenSubMenu=!item?.isOpenSubMenu;
    if((this.previousIndex != index) && this.previousIndex >= 0) {
      if(this.menus[this.previousIndex].isOpenSubMenu == false) {
        this.menus[this.previousIndex].isOpenSubMenu = true;
      }
    }
    this.previousIndex = index;
  }

}

/*$(function () {
  $(document).scroll(function () {
    var $nav = $(".navbar-fixed-top");
    $nav.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
  });
});*/
