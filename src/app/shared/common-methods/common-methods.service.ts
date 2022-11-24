import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { prismicEnConstants, prismicMmaEnConstants, prismicESportsEnConstants, prismicMotorEnConstants } from 'src/app/common/prismic-Enconstants';
import { prismicFrConstants, prismicMmaFrConstants, prismicESportsFrConstants, prismicMotorFrConstants } from 'src/app/common/prismic-Frconstants';
import {prismicPtConstants } from 'src/app/common/prismic-Ptconstants';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { Meta, Title } from '@angular/platform-browser';
import { DatePipe, DOCUMENT } from '@angular/common';
import Prismic from 'prismic-javascript';
import { BehaviorSubject } from 'rxjs';
declare let $: any;

@Injectable({
  providedIn: 'root'
})
export class CommonMethodsService {
  currentURL: any;
  public cancelOrder = new BehaviorSubject({});
  public cancelSuccess = new BehaviorSubject(false);
  constructor(private router: Router, private apiService: ApiService,
    private metaTagService: Meta, @Inject(DOCUMENT) private doc: any, private datepipe: DatePipe,
    private titleService: Title) {
    this.currentURL = window.location.origin;
  }

  addIndexMeta(flag?, isAddNoIndex?, temp?) {
    let origin = window.location.origin;
    if (temp) {
      this.metaTagService.addTags([
        { name: 'robots', content: 'noindex, nofollow' }
      ]);
    } else if (environment.motorDomain.includes(origin) || environment.motorFRDomain.includes(origin) ||
      environment.mmaFRDomain.includes(origin) || environment.mmaDomain.includes(origin) ||
      environment.esportsFRDomain.includes(origin) || environment.esportsDomain.includes(origin)
      || isAddNoIndex) {
      this.metaTagService.addTags([
        { name: 'robots', content: 'noindex, nofollow' }
      ]);
    } else {
      this.metaTagService.addTags([
        { name: 'robots', content: 'noindex, nofollow' }
      ]);
    }
    if (flag) {
      let link: HTMLLinkElement = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      if (environment.europeDomain.includes(origin) && localStorage.language == "en") {
        let loc = window.location.href.replace("https://eu.", "https://");
        loc = loc.replace("/en/", "/");
        if (loc.endsWith("/en")) {
          loc = loc.replace("/en", "");
        }
        link.setAttribute('href', loc);
        this.doc.head.appendChild(link);

      } else if (environment.mainDomain.includes(origin) ||
        environment.mmaDomain.includes(origin) ||
        environment.esportsDomain.includes(origin) || environment.europeDomain.includes(origin) ||
        environment.motorDomain.includes(origin) || environment.mmaFRDomain.includes(origin) ||
        environment.esportsFRDomain.includes(origin) || environment.motorFRDomain.includes(origin)) {
        link.setAttribute('href', window.location.href);
        this.doc.head.appendChild(link);
      }
    }



  }

  addMetaTag(seoSection, ogSection?, twitterSection?, imageUrl?) {
    if (seoSection?.primary?.title)
      this.titleService.setTitle(seoSection?.primary?.title);

    if (seoSection?.primary?.description) {
      this.metaTagService.updateTag(
        { name: 'description', content: seoSection?.primary?.description }, "name='description'"
      );
    } else {
      this.metaTagService.removeTag("name='description'");
    }

    if (seoSection?.primary?.metadata) {
      this.metaTagService.updateTag(
        { name: 'metadata', content: seoSection?.primary?.metadata }, "name='metadata'"
      );
    }
    else {
      this.metaTagService.removeTag("name='metadata'");
    }
    if (seoSection?.primary?.author) {
      this.metaTagService.updateTag(
        { name: 'author', content: seoSection?.primary?.author }, "name='author'"
      );
    }
    else {
      this.metaTagService.removeTag("name='author'");
    }

    if (ogSection?.primary?.title) {
      this.metaTagService.updateTag(
        { name: 'og:title', content: ogSection?.primary?.title }, "name='og:title'"
      );
    } else {
      this.metaTagService.removeTag("name='og:title'");
    }

    if (ogSection?.primary?.site_name) {
      this.metaTagService.updateTag(
        { name: 'og:site_name', content: ogSection?.primary?.site_name }, "name='og:site_name'"
      );
    }
    else if (ogSection?.primary?.sitename) {
      this.metaTagService.updateTag(
        { name: 'og:site_name', content: ogSection?.primary?.sitename }, "name='og:site_name'"
      );
    }
    else {
      this.metaTagService.removeTag("name='og:site_name'");
    }

    if (ogSection?.primary?.description) {
      this.metaTagService.updateTag(
        { name: 'og:description', content: ogSection?.primary?.description }, "name='og:description'"
      );
    } else {
      this.metaTagService.removeTag("name='og:description'");
    }

    if (ogSection?.primary?.image?.url) {
      this.metaTagService.updateTag(
        { name: 'og:image', content: ogSection?.primary?.image?.url }, "name='og:image'"
      );
    } else {
      this.metaTagService.removeTag("name='og:image'");
    }


    if (ogSection?.primary?.type) {
      this.metaTagService.updateTag(
        { name: 'og:type', content: ogSection?.primary?.type }, "name='og:type'"
      );
    } else {
      this.metaTagService.removeTag("name='og:type'");
    }
    if (ogSection?.primary?.url?.url) {
      this.metaTagService.updateTag(
        { name: 'og:url', content: ogSection?.primary?.url?.url }, "name='og:url'"
      );
    } else {
      this.metaTagService.removeTag("name='og:url'");
    }


    if (twitterSection?.primary?.card) {
      this.metaTagService.updateTag(
        { name: 'twitter:card', content: twitterSection?.primary?.card }, "name='twitter:card'"
      );
    } else {
      this.metaTagService.removeTag("name='twitter:card'");
    }

    if (twitterSection?.primary?.site) {
      this.metaTagService.updateTag(
        { name: 'twitter:site', content: twitterSection?.primary?.site }, "name='twitter:site'"
      );
    } else {
      this.metaTagService.removeTag("name='twitter:site'");
    }

    if (twitterSection?.primary?.title) {
      this.metaTagService.updateTag(
        { name: 'twitter:title', content: twitterSection?.primary?.title }, "name='twitter:title'"
      );
    } else {
      this.metaTagService.removeTag("name='twitter:title'");
    }

    if (twitterSection?.primary?.description) {
      this.metaTagService.updateTag(
        { name: 'twitter:description', content: twitterSection?.primary?.description }, "name='twitter:description'"
      );
    } else {
      this.metaTagService.removeTag("name='twitter:description'");
    }

    if (twitterSection?.primary?.image.url) {
      this.metaTagService.updateTag(
        { name: 'twitter:image', content: twitterSection?.primary?.image.url }, "name='twitter:image'"
      );
    } else {
      this.metaTagService.removeTag("name='twitter:image'");
    }
    if (imageUrl) {
      this.metaTagService.updateTag(
        { name: 'og:image:secure_url', content: imageUrl }, "name='og:image:secure_url'"
      );

      this.metaTagService.updateTag(
        { name: 'twitter:url', content: window.location.href }, "name='twitter:url'"
      );
    }
    else {
      this.metaTagService.removeTag("name='og:image:secure_url'");
      this.metaTagService.removeTag("name='twitter:url'");
    }


  }

  getLanguageDetails() {
    let res: any = {};
    if (localStorage.getItem('language') == 'fr') {
      res.constant = prismicFrConstants
      res.langkey = 'fr-fr'
    } else {
      res.constant = prismicEnConstants
      res.langkey = 'en-us'
    }
    return res;
  }

  getSubDomainLanguage() {
    let res: any = {};
    /*if(localStorage.getItem('language') == 'fr') {
      if(environment.mmaDomain.indexOf(this.currentURL) >= 0) { // MMA For testing
        res.constant = prismicMmaFrConstants;
        res.apiUrl = environment.prismicmma;
      } else if(environment.esportsDomain.indexOf(this.currentURL) >= 0) { // ESports For testing
        res.constant = prismicESportsFrConstants;
        res.apiUrl = environment.prismicesports;
      } else if(environment.motorDomain.indexOf(this.currentURL) >= 0) { // Motor Sports For testing
        res.constant = prismicMotorFrConstants;
        res.apiUrl = environment.prismicmotor;
      } else {
        res.constant = prismicFrConstants
        res.apiUrl = environment.prismic9mm;
      }
      res.langkey = 'fr-fr'
    } else {
      if(environment.mmaDomain.indexOf(this.currentURL) >= 0) { // MMA For testing
        res.constant = prismicMmaEnConstants;
        res.apiUrl = environment.prismicmma;
      } else if(environment.esportsDomain.indexOf(this.currentURL) >= 0) { // ESports For testing
        res.constant = prismicESportsEnConstants;
        res.apiUrl = environment.prismicesports;
      } else if(environment.motorDomain.indexOf(this.currentURL) >= 0) { // Motor Sports For testing
        res.constant = prismicMotorEnConstants;
        res.apiUrl = environment.prismicmotor;
      } else {
        res.constant = prismicEnConstants
        res.apiUrl = environment.prismic9mm;
      }
      res.langkey = 'en-us'
    }*/

    if (environment.mmaDomain.indexOf(this.currentURL) >= 0) { // MMA For testing
      /*if(localStorage.getItem('language') == 'fr') { 
        res.constant = prismicMmaFrConstants;
      } else {*/
      res.constant = prismicMmaEnConstants;
      // }
      res.apiUrl = environment.prismicmma;
    } else if (environment.mmaFRDomain.indexOf(this.currentURL) >= 0) { // FR MMA For testing      
      res.constant = prismicMmaFrConstants;
      res.apiUrl = environment.prismicmma;
    }

    else if (environment.esportsDomain.indexOf(this.currentURL) >= 0) { // ESports For testing
      /* if(localStorage.getItem('language') == 'fr') { 
         res.constant = prismicESportsFrConstants;
       } else {*/
      res.constant = prismicESportsEnConstants;
      // }
      res.apiUrl = environment.prismicesports;
    } else if (environment.esportsFRDomain.indexOf(this.currentURL) >= 0) { // FR ESports For testing     
      res.constant = prismicESportsFrConstants;
      res.apiUrl = environment.prismicesports;
    }

    else if (environment.motorDomain.indexOf(this.currentURL) >= 0) { // Motor Sports For testing
      /* if(localStorage.getItem('language') == 'fr') { 
         res.constant = prismicESportsFrConstants;
       } else {*/
      res.constant = prismicMotorEnConstants;
      // }
      res.apiUrl = environment.prismicmotor;
    } else if (environment.motorFRDomain.indexOf(this.currentURL) >= 0) { // FR Motor Sports For testing     
      res.constant = prismicMotorFrConstants;
      res.apiUrl = environment.prismicmotor;
    } else if (environment.brazilDomain.indexOf(this.currentURL) >= 0) { // Brazil For testing
      res.constant = prismicPtConstants;
      res.apiUrl = environment.prismicbrazil;
    }
    /*else if(environment.motorDomain.indexOf(this.currentURL) >= 0) { // Motor Sports For testing
      if(localStorage.getItem('language') == 'fr') { 
        res.constant = prismicMotorFrConstants;
      } else {
        res.constant = prismicMotorEnConstants;
      }
      res.apiUrl = environment.prismicmotor;
    }*/ else {                                                        // 9MM For testing
      if (localStorage.getItem('language') == 'fr') {
        res.constant = prismicFrConstants;
      } else {
        res.constant = prismicEnConstants;
      }
      res.apiUrl = environment.prismic9mm;
    }

    localStorage.getItem('language') == 'pt' ? res.langkey = 'pt-br' : res.langkey = 'en-us';

    return res;
  }

  getRoutePath(menuname, lang?, isLngChanged?) {
    if (!lang) {
      lang = localStorage.getItem('language');
    }
    let rtPath;
    if (menuname != '' && menuname.includes('/')) {
      rtPath = menuname;
    } else {
      rtPath = prismicEnConstants[menuname] == null ? '/' : prismicEnConstants[menuname];
      if (environment.europeDomain.includes(window.location.origin) /*|| environment.motorDomain.includes(window.location.origin)*/) {
        if ((lang && lang == "fr") || (!isLngChanged && this.router.url.includes("/fr"))) {
          rtPath = prismicFrConstants[menuname] == null ? '/' : prismicFrConstants[menuname];
          rtPath = "/" + localStorage.getItem('language') + rtPath;
        } else if (/*!this.router.url.includes("/fr") ||*/ this.router.url.includes("/en") || isLngChanged) {
          //  if(window.location.href.includes("/en") || lang =="fr")
          rtPath = "/" + localStorage.getItem('language') + rtPath;
        }
      } else if ((lang && lang == "fr") && (environment.mmaDomain.includes(origin) || environment.esportsDomain.includes(origin)
        || environment.motorDomain.includes(window.location.origin)
        || environment.mmaFRDomain.includes(origin) || environment.esportsFRDomain.includes(origin)
        || environment.motorFRDomain.includes(window.location.origin))) {
        rtPath = prismicFrConstants[menuname] == null ? '/' : prismicFrConstants[menuname];
      }
    }



    return rtPath;
  }

  getKeyByValue(object, value) {
    if (object == null) {
      object = this.getConstant();
    }

    value = value.replace("/en", "");
    value = value.replace("/fr", "");
    if (value.indexOf(":title") > -1) {
      value = value.replace("/:title", "");
    }
    value = (!value || value == '') ? '/' : value;
    return Object.keys(object).find(key => object[key] === value);
  }

  goToInner(rt, item, flag?) {
    let title = item.uid;
    title = title ? title.replace(/ /g, "-") : "";
    title = title.toLowerCase();
    this.router.navigate([this.getRoutePath(rt), title])
      .then(() => {
        if (flag)
          window.location.reload();
      });
  }

  getConstant() {
    let object = prismicPtConstants;
    let origin = window.location.origin;
    if ((environment.europeDomain.includes(origin) || environment.motorFRDomain.includes(origin) ||
      environment.mmaFRDomain.includes(origin) ||
      environment.esportsFRDomain.includes(origin))
      && localStorage.getItem('language') == 'fr') {
      object = prismicFrConstants;
    }

    return object
  }

  async createCheckout(lineItemsToAdd, cartDetails?, cartDetailIndex?) {
    this.apiService.isLoading.next(true);
    let checkoutdetail = {
      lineItems: lineItemsToAdd,
      customerAccessToken: '',
      checkoutId: '',
    };
    if (
      cartDetails?.length &&
      cartDetailIndex != null &&
      cartDetailIndex > -1 &&
      cartDetails[cartDetailIndex]?.checkoutId &&
      cartDetails[cartDetailIndex]?.checkoutId != 'null' &&
      cartDetails[cartDetailIndex]?.checkoutId != ''
    ) {
      checkoutdetail.checkoutId = cartDetails[cartDetailIndex]?.checkoutId;
    }
    let profile = JSON.parse(localStorage.getItem('profile'));
    if (profile && localStorage.getItem('uToken')) {
      checkoutdetail.customerAccessToken = localStorage.getItem('uToken');
    }

    this.apiService.createCheckout(checkoutdetail).subscribe(
      (res: any) => {
        if (res?.status === '7400') {
          if (res?.value?.checkoutId) {
            if (
              cartDetails?.length &&
              cartDetailIndex != null &&
              cartDetailIndex > -1
            ) {
              cartDetails[cartDetailIndex].checkoutId = btoa(res?.value?.checkoutId);
              localStorage.setItem('cartDetails', JSON.stringify(cartDetails));
            }
          }

          if (res?.value.webUrl) {
            window.location.href = res?.value?.webUrl;
          }
        }
        this.apiService.isLoading.next(false);
      },
      (err) => {
        console.log(err);
        this.apiService.isLoading.next(false);
      }
    );
  }

  async createCart(lineItemsToAdd, cartDetails?, cartDetailIndex?) {
    this.apiService.isLoading.next(true);
    let checkoutdetail = {
      lineItems: lineItemsToAdd,
      customerAccessToken: '',
      cartId: '',
    };
    if (
      cartDetails?.length &&
      cartDetailIndex != null &&
      cartDetailIndex > -1 &&
      cartDetails[cartDetailIndex]?.cartId &&
      cartDetails[cartDetailIndex]?.cartId != 'null' &&
      cartDetails[cartDetailIndex]?.cartId != ''
    ) {
      checkoutdetail.cartId = cartDetails[cartDetailIndex]?.cartId;
    }
    let profile = JSON.parse(localStorage.getItem('profile'));
    if (profile && localStorage.getItem('uToken')) {
      checkoutdetail.customerAccessToken = localStorage.getItem('uToken');
    }

    this.apiService.createCart(checkoutdetail).subscribe(
      (res: any) => {
        if (res?.status === '7400') {
          if (res?.value?.cartId) {
            if (
              cartDetails?.length &&
              cartDetailIndex != null &&
              cartDetailIndex > -1
            ) {
              cartDetails[cartDetailIndex].cartId = res?.value?.cartId;
              localStorage.setItem('cartDetails', JSON.stringify(cartDetails));
            }
          }

          if (res?.value.webUrl) {
            window.location.href = res?.value?.webUrl;
          }
        }
        this.apiService.isLoading.next(false);
      },
      (err) => {
        console.log(err);
        this.apiService.isLoading.next(false);
      }
    );
  }


  async checkOrderStatusOld(cartData, loginEmail?) {
    if (
      cartData?.index != null &&
      cartData?.index > -1 &&
      cartData?.cartDetailsList &&
      cartData?.cartDetailsList[cartData.index]?.checkoutId
    ) {

      let checkoutRes = await this.apiService.getCheckoutData(cartData.cartDetailsList[cartData.index].checkoutId).subscribe((res: any) => {
        if (res?.status == 7400 && res?.value?.order != null) {
          //here cart items goes to clear
          //use async await method after the response of this method application should run
          cartData.cartDetailsList.splice(cartData.index, 1);
          localStorage.setItem(
            'cartDetails',
            JSON.stringify(cartData.cartDetailsList)
          );
          this.apiService.cartCount.next(0);
          this.apiService.cartDetails.next({
            cartCountDetail: {
              qCount: 0,
              pCount: 0,
              subTotal: 0,
              note: ''
            },
            cartList: []
          });
        } else if (loginEmail) {
          this.updateCartDetails(loginEmail);
        }

      }, err => {

      })
      console.log(checkoutRes);
    } else if (loginEmail) {
      this.updateCartDetails(loginEmail);
    }
  }

  async checkOrderStatus(cartData, loginEmail?) {
    if (
      cartData?.index != null &&
      cartData?.index > -1 &&
      cartData?.cartDetailsList &&
      cartData?.cartDetailsList[cartData.index]?.cartId
    ) {
      
      let checkoutRes = await this.apiService.getCartData(cartData.cartDetailsList[cartData.index].cartId).subscribe((res: any) => {
      if (res?.status ==7400 && res?.value?.data?.cart == null) {
        //here cart items goes to clear
        //use async await method after the response of this method application should run
        cartData.cartDetailsList.splice(cartData.index, 1);
        localStorage.setItem(
          'cartDetails',
          JSON.stringify(cartData.cartDetailsList)
        );
        this.apiService.cartCount.next(0);
        this.apiService.cartDetails.next({
          cartCountDetail :{
            qCount: 0,
            pCount: 0,
            subTotal: 0,
            note: ''
          },
          cartList : []
        });
      } else if (loginEmail) {
        this.updateCartDetails(loginEmail);
      }

    }, err => {
     
    })
    console.log(checkoutRes);
    } else if (loginEmail) {
      this.updateCartDetails(loginEmail);
    }
  }

  updateCartDetails(loginEmail) {
    let cartDetails = this.checkEmpty(JSON.parse(localStorage.getItem('cartDetails')), []);
    let index = cartDetails.findIndex(item => (item == null || item?.email == null || item?.email == ''));
    let cartEmailIndex = cartDetails.findIndex(item => (item?.email == loginEmail));
    if ((cartEmailIndex == null || cartEmailIndex < 0) && index != null && index > -1) {
      cartDetails[index].email = loginEmail;
    } else if (cartEmailIndex != null && cartEmailIndex > -1 && index != null && index > -1) {
      let emailDataList = [];
      if (cartDetails[cartEmailIndex]?.list) {
        emailDataList = JSON.parse(JSON.stringify(cartDetails[cartEmailIndex].list));
        let list = cartDetails[index];
        for (let item of cartDetails[index]?.list) {
          let eIndex = cartDetails[cartEmailIndex]?.list.findIndex(eData => (item.variantId == eData.variantId));
          if (eIndex > -1) {
            cartDetails[cartEmailIndex].countDetails.qCount += item.quantity;
            emailDataList[eIndex].quantity = emailDataList[eIndex].quantity + item.quantity;
            let total = parseFloat(emailDataList[eIndex].total) + parseFloat(item.total);
            emailDataList[eIndex].total = total.toFixed(2);
            emailDataList[eIndex].totalQuantity = item.totalQuantity;
          } else {
            emailDataList.push(item);
            cartDetails[cartEmailIndex].countDetails.pCount += 1;
            cartDetails[cartEmailIndex].countDetails.qCount += item.quantity;
          }
        }
        let subTotal = 0;
        for (let data of emailDataList) {
          subTotal += (data.price * data.quantity);
        }
        cartDetails[cartEmailIndex].countDetails.subTotal = subTotal.toFixed(2);
        cartDetails[cartEmailIndex].list = emailDataList;
        cartDetails.splice(index, 1);
      }
    }

    localStorage.setItem('cartDetails', JSON.stringify(cartDetails));
  }

  getShortName(accountData) {
    let obj: any = { name: '', shortName: '' };
    if (accountData?.first_name?.length > 0) {
      obj.name = accountData?.first_name;
      obj.shortName = accountData?.first_name[0];
    }
    if (accountData?.last_name?.length > 0) {
      obj.name += " " + accountData?.last_name;
      obj.shortName += accountData?.last_name[0];
    }

    return obj;
  }

  getCartList(cartDetail, variants, quantity, product, toastr, productImage?) {
    if (!productImage) {
      productImage = product.image;
    }
    let prevCount = (cartDetail?.countDetails) ? cartDetail.countDetails : { qCount: 0, pCount: 0, subTotal: 0, note: '' };
    let cartDetList = (cartDetail?.list) ? cartDetail.list : [];
    let index = cartDetList.findIndex(item => item.variantId == variants.id);
    if (index != null && index > -1) {
      if (variants.inventory_policy == "continue" || (cartDetList[index].quantity + quantity) <= variants.inventory_quantity) {
        cartDetList[index].quantity = cartDetList[index].quantity + quantity;
        let total = parseFloat(cartDetList[index].total) + (variants.price * quantity);
        cartDetList[index].total = total.toFixed(2);
        cartDetList[index].totalQuantity = variants.inventory_quantity;
      } else {
        //All 20 Energy 1-9MM Energy Drink - 100ml are in your cart.
        if (variants.inventory_quantity < 1) {
          toastr.error(product.title + " - " + variants.title + " Out of Stock.", "Error")
        } else {
          toastr.error("All " + product.title + " - " + variants.title + " are in your cart.", "Error");
        }
        return;
      }
    } else {
      let total = (variants.price * quantity);
      prevCount.pCount += 1;
      cartDetList.push({
        quantity: quantity,
        title: product.title,
        price: variants.price,
        image: productImage.src,
        total: total.toFixed(2),
        totalQuantity: variants.inventory_quantity,
        inventoryPolicy: variants.inventory_policy,
        variantTitle: variants.title,
        variantId: variants.id,
        variantsGraphqlId: variants.admin_graphql_api_id,
      })
    }

    let subTotal = 0;
    for (let data of cartDetList) {
      subTotal += (data.price * data.quantity);
    }


    prevCount.qCount += quantity;
    prevCount.subTotal = subTotal.toFixed(2);
    return { cartDetList: cartDetList, prevCount: prevCount };
  }

  checkEmpty(data: any, defaultValue) {
    if (data == null || data == '') {
      return defaultValue;
    } else {
      return data;
    }
  }

  getCurrentCartDetails() {
    let cDetails = this.checkEmpty(JSON.parse(localStorage.getItem('cartDetails')), []);
    let userEmail = localStorage.getItem('email');
    let cartData = { cartDetailsList: cDetails, index: -1 };
    if (userEmail && userEmail != 'null') {
      cartData.index = cDetails.findIndex(item => (item?.email == userEmail));
    } else {
      cartData.index = cDetails.findIndex(item => (item == null || item?.email == null || item?.email == ''));
    }

    return cartData;
  }

  getCartCountDetails() {
    let cDetails = this.checkEmpty(JSON.parse(localStorage.getItem('cartDetails')), []);
    let userEmail = localStorage.getItem('email');
    let cartCountDetails = {
      qCount: 0,
      pCount: 0,
      subTotal: 0,
      note: ''
    };
    let index
    if (userEmail && userEmail != 'null') {
      index = cDetails.findIndex(item => (item?.email == userEmail));
    } else {
      index = cDetails.findIndex(item => (item == null || item?.email == null || item?.email == ''));
    }
    if (cDetails[index]?.countDetails) {
      cartCountDetails = cDetails[index].countDetails;
    }
    return cartCountDetails;
  }

  validateEmail(email) {
    const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regularExpression.test(String(email).toLowerCase());
  }

  async getBlogPost() {
    let res = {
      contentSection: [],
      recentPosts: [],
      tagSection: []
    }
    let domainLang = this.getSubDomainLanguage();
    await Prismic.api(domainLang.apiUrl).then(function (api) {
      return api.query(Prismic.Predicates.at('document.type', 'blog_post'), { lang: domainLang.langkey, pageSize: 500 });
    }).then((function (response) {
      console.log("PrismicJSType: ", response);
      if (response?.results?.length > 0) {
        this.postDateFormat(response.results);
        res.contentSection = response?.results;
        res.contentSection?.sort((a, b) => ((a.data.postDate) > (b.data.postDate) ? -1 : 1));

        let tagMap = new Map();
        res.contentSection?.forEach(item => {
          for (let obj in item?.data) {
            if (obj != null && obj.indexOf('body') > -1 && !Number.isNaN(obj.replace("body", ""))) {
              let prismic = item?.data[obj]?.length > 0 ? item?.data[obj][0] : null;
              if (prismic) {
                switch (prismic.slice_type) {
                  case 'seosection':
                    item.data.seoSection = prismic;
                    break;
                  case 'ogsection':
                  case 'og_section':
                    item.data.ogSection = prismic;
                    break;
                  case 'twitter_section':
                  case 'twitter_section':
                    item.data.twitterSection = prismic;
                    break;
                  case 'article_section':
                  case 'article_details':
                    {
                      item.data.category = prismic.primary.category;
                      item.data.description = prismic.primary.description;
                      item.data.more_contents = prismic.primary.more_contents;
                    }
                    break;
                  case 'author_section':
                  case 'author_details':
                    {
                      item.data.author_name = prismic.primary.name;
                      item.data.author_description = prismic.primary.description1;
                      item.data.author_image = prismic.primary.image1;

                      item.data.author_facebook_link = prismic.primary.facebook_link;
                      item.data.author_twitter_link = prismic.primary.twitter_link;
                      item.data.author_linkedin_link = prismic.primary.linkedin_link;
                    }
                    break;
                  default:

                }
              }
            }
          }

          // if(item.data?.body4[0]?.items?.length > 0){
          //   item.data.tag_list = item.data.body4[0].items;
          if (item?.data?.tag_list?.length > 1) {
            item.data.tag = item?.data?.tag_list.reduce((tag, el) => {
              if (tag?.tag_name)
                tag = el.tag_name;
              return tag += ", " + el.tag_name;
            });
            let map = new Map(item.data.tag_list.map(tag => [tag.tag_name, tag.tag_name]));
            tagMap = new Map([...tagMap].concat([...map]));
          } else if (item?.data?.tag_list?.length > 0) {
            let temp = item.data.tag_list[0];
            tagMap.set(temp.tag_name, temp.tag_name);
            item.data.tag = temp.tag_name;
          }
          // }

        })
        res.tagSection = Array.from(tagMap);

        let temp = JSON.parse(JSON.stringify(res.contentSection));

        if (temp?.length > 4) {
          res.recentPosts = temp.slice(0, 4);
        } else {
          res.recentPosts = temp;
        }
        console.log("recent posts ", res.recentPosts);
      }

    }).bind(this), function (err) {
      console.log("Something went wrong: ", err);
    });

    return res;
  }

  async getPrismicDatas(type) {
    let domainLang = this.getSubDomainLanguage();
    let categoryList = [];
    await Prismic.api(domainLang.apiUrl).then(function (api) {
      return api.query(Prismic.Predicates.at('document.type', type), { lang: domainLang.langkey, pageSize: 1000 });
      //return api.query(Prismic.Predicates.at('document.uid', 'home'),{ lang : 'en-us' });
    }).then((function (response) {
      console.log("blog_category: ", response);
      if (response?.results?.length > 0) {
        categoryList = response.results;
      }

    }).bind(this), function (err) {
      console.log("Something went wrong: ", err);
    });

    return categoryList;
  }

  postDateFormat(post) {
    post?.forEach(item => {
      item.data.postDate = new Date(item?.data?.date);
      let date = this.datepipe.transform(item?.data?.date, 'MMMM d, y', 'es-ES');
      item.data.date = date;
    })
    return post;
  }

  navigate(path, params?) {
    let routing;
    if (params != null) {
      routing = [path, params];
    } else {
      routing = [path];
    }
    console.log("routing ", routing);
    this.router.navigate(routing);
  }

  showHidePlayPauseBtn(index, showPauseBtn?) {
    if (showPauseBtn) {
      $('#instaPlayId' + index).hide();
      $('#instaPauseId' + index).show();
    } else {
      $('#instaPlayId' + index).show();
      $('#instaPauseId' + index).hide();
    }
  }


}