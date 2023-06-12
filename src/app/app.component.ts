import { Component, Inject, Renderer2 } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ApiService } from './services/api.service';
import { environment } from 'src/environments/environment';
import { Event as NavigationEvent } from "@angular/router";
import { filter } from "rxjs/operators";
import { prismicEnConstants } from './common/prismic-Enconstants';
import { TranslateService } from '@ngx-translate/core';
import { CommonMethodsService } from 'src/app/shared/common-methods/common-methods.service';
import Prismic from 'prismic-javascript';
import { DOCUMENT } from '@angular/common';
declare let $: any;

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'ninemmenergy-brazil-front-end';
	loading: boolean;
	hasPreviousNavigation;
	apiUrl: any;
	constructor(private loaderService: ApiService, private router: Router, translate: TranslateService,
		public commonMtd: CommonMethodsService, private _renderer2: Renderer2, @Inject(DOCUMENT) private _document: Document) {
		//call the find order status method  and use below cartDetils clear method for clear cart information
		this.commonMtd.checkOrderStatus(this.commonMtd.getCurrentCartDetails());
		let cartDetails = this.commonMtd.checkEmpty(JSON.parse(localStorage.getItem('cartDetails')), []);
		if (cartDetails && cartDetails.length > 0 && (!cartDetails[0]?.list?.length || !cartDetails[0]?.hasOwnProperty('cartId') )) {
			localStorage.setItem('cartDetails', null);
			// localStorage.setItem('cartCount',JSON.stringify({
			// 	qCount:0,
			// 	pCount:0,
			// 	subTotal:0,
			// 	note:''
			//   }));
		}

		// if(!localStorage.getItem('cartCount') || localStorage.getItem('cartCount') =='0'){
		// 	localStorage.setItem('cartCount',JSON.stringify({
		// 		qCount:0,
		// 		pCount:0,
		// 		subTotal:0,
		// 		note:''
		// 	  }));
		// }

		if (environment.oldUiUrl.includes(window.location.origin)) {
			window.location.href = window.location.href.replace("//www.", "//");//window.location.href.replace("4202", "4200");
		} else if (window.location.href.includes('/fr')/* && (!localStorage.getItem("language") || localStorage.getItem("language") != "en")*/
			|| environment.mmaFRDomain.includes(window.location.origin) || environment.esportsFRDomain.includes(window.location.origin)
			|| environment.motorFRDomain.includes(window.location.origin)) {
			localStorage.setItem("language", "fr");
		} else if (window.location.href.includes('/en') || environment.europeDomain.includes(window.location.origin)
			|| environment.mmaDomain.includes(window.location.origin) || environment.esportsDomain.includes(window.location.origin)
			|| environment.motorDomain.includes(window.location.origin)) {
			localStorage.setItem("language", "en");
		} 
		else if(environment.brazilDomain.includes(window.location.origin)) {
			localStorage.setItem("language", "pt");
		}

		translate.use(localStorage.getItem('language') ? localStorage.getItem('language') : 'pt');

		let domainLanguage = this.commonMtd.getSubDomainLanguage();
		console.log("app component domain lanugage ", domainLanguage);
		this.apiUrl = domainLanguage.apiUrl;

		this.getPrismicDatas();
		this.loaderService.isLoading.subscribe((v) => {
			this.loading = v;
		});

		//
		router.events
			.pipe(
				// The "events" stream contains all the navigation events. For this demo,
				// though, we only care about the NavigationStart event as it contains
				// information about what initiated the navigation sequence.
				filter(
					(event: NavigationEvent) => {
						let origin = window.location.origin;
						if (environment.europeDomain.includes(origin) && event["url"] && !event["url"].includes("/en") && !event["url"].includes("/fr") &&
							localStorage.getItem("language") == "fr") {
							this.router.navigateByUrl("/" + localStorage.getItem("language") + (event['url'] == "/" ? "" : event['url']));
						} else if (environment.europeDomain.includes(origin) && event["url"] && event["url"].includes("/fr") &&
							localStorage.getItem("language") == "en") {
							let routeUrl = event["url"].replace("/fr", "");
							this.router.navigateByUrl("/" + localStorage.getItem("language") + (routeUrl == "/" ? "" : routeUrl));
						}
						else if (environment.europeDomain.includes(origin) && event["url"] && event["url"].includes("/en") &&
							localStorage.getItem("language") == "fr") {
							console.log("when changed en to fr , current page is en");
							let routeUrl = event["url"].replace("/en", "");
							this.router.navigateByUrl("/" + localStorage.getItem("language") + (routeUrl == "/" ? "" : routeUrl));
						}
						else if (environment.uiUrl.includes(origin) && event["url"] &&
							(event["url"].endsWith("/en") || event["url"].endsWith("/fr") ||
								event["url"].includes("/en/") || event["url"].includes("/fr/"))) {
							let routeUrl = event["url"].replace("/en", "");
							routeUrl = routeUrl.replace("/fr", "");
							this.router.navigateByUrl(routeUrl);
						}
						return (event instanceof NavigationStart);

					}
				)
			)
			.subscribe(
				(event: NavigationStart) => {
					let menuName = Object.keys(prismicEnConstants).find(key => prismicEnConstants[key] === event.url);
					if (event.url.includes("blog") || menuName == 'blog') {
						menuName = 'blog';
					} else if (menuName == 'socialresponsbility') {
						menuName = 'about';
					}
					else if (event.url.includes("neurototracker-clinical-studies") || menuName == 'neurotrackerclinical') {
						menuName = 'brainworkout';
					} else if (event.url.includes("clinical-studies") || menuName == 'clinical' || menuName == 'whatsasta'
						|| menuName == 'whatsinside') {
						//menuName = 'ourproducts';
						menuName = 'whatsasta';
					} else if (menuName == null && (event.url.includes("/shop") || event.url.includes("/boutique"))) {
						menuName = 'shop';
					} else if (menuName == null) {
						menuName = "";
					}
					localStorage.setItem('menu', menuName);
					console.group("NavigationStart Event");
					// Every navigation sequence is given a unique ID. Even "popstate"
					// navigations are really just "roll forward" navigations that get
					// a new, unique ID.
					console.log("navigation id:", event.id);
					console.log("route:", event.url);
					// The "navigationTrigger" will be one of:
					// --
					// - imperative (ie, user clicked a link).
					// - popstate (ie, browser controlled change such as Back button).
					// - hashchange
					// --
					// NOTE: I am not sure what triggers the "hashchange" type.
					console.log("trigger:", event.navigationTrigger);

					// This "restoredState" property is defined when the navigation
					// event is triggered by a "popstate" event (ex, back / forward
					// buttons). It will contain the ID of the earlier navigation event
					// to which the browser is returning.
					// --
					// CAUTION: This ID may not be part of the current page rendering.
					// This value is pulled out of the browser; and, may exist across
					// page refreshes.
					if (event.restoredState) {
						router.navigate([event.url]).then(() => {
							window.location.reload();
						});
						console.warn(
							"restoring navigation id:",
							event.restoredState.navigationId
						);

					} else {
						if (this.loaderService.previousUrl && this.loaderService.previousUrl != event.url) {
							localStorage.setItem("isLoadingFirst", JSON.stringify(false))
							this.loaderService.previousUrl = event.url;
							setTimeout(() => {
								this.loaderService.previousUrl = event.url;
								window.scrollTo(0, 0);
								window.location.reload();
							}, 0);
						}else{
							localStorage.setItem("isLoadingFirst", JSON.stringify(true))
						}
						this.loaderService.previousUrl = event.url;
					}
					console.groupEnd();

				}
			)
			;
		//
	}

	getPrismicDatas() {
		return Prismic.api("https://9mmenergydrink-brazil.prismic.io/api/v2").then(function (api) {
			return api.query(Prismic.Predicates.at('document.id', "Yz_vlREAACMAjcu_"),{ lang : 'pt-br'});
		}).then((function (response) {

			let prismicData = response?.results[0]?.data;
			for (let obj in prismicData) {
				if (obj != null && obj.indexOf('body') > -1 && !Number.isNaN(obj.replace("body", ""))) {
					response?.results[0]?.data[obj]?.forEach(prismic => {
						if (prismic) {
							switch (prismic.slice_type) {
								case 'head_section':
									if (prismic?.primary?.gtm_script) {
										$(prismic.primary.gtm_script).appendTo(document.head);
									}
									console.log("head_section", prismic)
									break;
								case 'body_section':
									if (prismic?.primary?.gtm_noscript) {

										$(prismic.primary.gtm_noscript).appendTo(document.body);
									}
									break;
								case 'intercom_section':
									if (prismic?.primary?.intercom_script) {
										$(prismic.primary.intercom_script).appendTo(
											document.body
										);
									}
									break;
								case 'organization_schema':
									this.addSchemaScript(prismic.primary.schema_script);
									break;
								case 'website_schema':
									this.addSchemaScript(prismic.primary.schema_script);
									break;
								case 'facebook_pixel':
									if (prismic?.primary?.meta_pixel_code) {
										$(prismic.primary.meta_pixel_code).appendTo(document.head);
									}
									break;
								case 'adroll_pixel':
									if (prismic?.primary?.adroll_pixel_script) {
										$(prismic.primary.adroll_pixel_script).appendTo(document.head);
									}
									break;
								default:
									console.log('type', prismic)
								break;
							}
						}
					})
				}
			}
		}).bind(this), function (err) {
			console.log("Something went wrong: ", err);
		});
	}

	addSchemaScript(script) {
		/*schema script*/
		if (script) {
			let schema = this._renderer2.createElement('script');
			schema.type = `application/ld+json`;
			schema.text = script;
			this._renderer2.appendChild(this._document.head, schema);
			/*schema script*/
		}
	}
}