import { Component, OnInit } from '@angular/core';
import Prismic from 'prismic-javascript';
import "@lottiefiles/lottie-player";
import { Router } from '@angular/router';
import { CommonMethods } from 'src/app/common/common-methods';
import { DatePipe } from '@angular/common';
import { CommonMethodsService } from 'src/app/shared/common-methods/common-methods.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  pageTitle = "";
  page = 1;
  pageSize = 5;
  headerSection: any;
  footerSection: any;
  bannerSection: any;
  upcomingSection: any;
  corporateSection:any;
  showsSection:any;
  socialProofSection: any;
  upcomingCorporate:any;
  upcomingShows:any;
  filteredEvents: any={};
  shows: any={};
  allScheduledEvents: any;
  constant: any;
  langkey: any;
  apiUrl: any;
  currentOrientation = 'Corporate Events';
  lfaEvent: boolean = false;
  motorEvent: boolean = false;
  cartCount;// = JSON.parse(localStorage.getItem('cartCount'));
  common: CommonMethods;
  constructor(private router: Router,private datePipe: DatePipe, private commonMtd:CommonMethodsService) {
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
    this.common.clear();
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }

  gotoReadMore(){
    // this.common.navigate('/read-more', "events");
    this.router.navigate([this.commonMtd.getRoutePath('shop')], { fragment: 'down' });
  }

  getPrismicDatas() {
    let ogSection: any;
    let seoSection: any;
    let twitterSection: any;
    let id = this.constant['eventsId']
    let lang = this.langkey
    return Prismic.api(this.apiUrl).then(function (api) {
      return api.query(Prismic.Predicates.at('document.id', id),{ lang : lang});
    }).then((function (response) {
      if(response?.results[0]?.data?.page_title){
        this.pageTitle = response?.results[0]?.data?.page_title
      }
      response.results[0]?.data?.body.forEach(prismic => {
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
          case 'banner_section':
            this.bannerSection = prismic;
            break;
          case 'corporate_events':
            var today = new Date(this.datePipe.transform(new Date(),'yyyy-MM-dd')+' 00:00:00.000');
            let filteredSEvents  = prismic;
            filteredSEvents.items = prismic.items.filter(m =>{
              let date;
              if(m.from_date != null){
                m.date = m.from_date;
                m.display_date =  this.datePipe.transform(new Date(m.from_date),'d MMM y');
                date = new Date(this.datePipe.transform(new Date(m.from_date),'yyyy-MM-dd')+' 00:00:00.000');
              }
          
              if(m.to_date != null){
                m.date = m.to_date;
                let endDate = new Date(this.datePipe.transform(new Date(m.to_date),'yyyy-MM-dd')+' 00:00:00.000');
                if(date < endDate){
                  m.display_date =  this.datePipe.transform(new Date(date),'d') +' - ' + this.datePipe.transform(new Date(m.to_date),'d MMM y');
                  date = endDate;
                }                  
              }
              return today <= date;
            });
            
            filteredSEvents?.items.sort((a, b) => ((new Date(a.date) < new Date(b.date)) ? -1 : 1));
            this.motorEvent = true;
            this.showsSection = filteredSEvents;
            break;
            case 'shows_section':
            var today = new Date(this.datePipe.transform(new Date(),'yyyy-MM-dd')+' 00:00:00.000');
           
            let filteredEvents  = prismic;
            filteredEvents.items = prismic.items.filter(m =>{
              let date;
              if(m.from_date != null){
                m.date = m.from_date;
                m.display_date =  this.datePipe.transform(new Date(m.from_date),'d MMM y');
                date = new Date(this.datePipe.transform(new Date(m.from_date),'yyyy-MM-dd')+' 00:00:00.000');
              }
          
              if(m.to_date != null){
                m.date = m.to_date;
                let endDate = new Date(this.datePipe.transform(new Date(m.to_date),'yyyy-MM-dd')+' 00:00:00.000');
                if(date < endDate){
                  m.display_date =  this.datePipe.transform(new Date(date),'d') +' - ' + this.datePipe.transform(new Date(m.to_date),'d MMM y');
                  date = endDate;
                }                  
              }
              return today <= date;
            });

            filteredEvents?.items.sort((a, b) => ((new Date(a.date) < new Date(b.date)) ? -1 : 1));
            this.lfaEvent = true;
            this.corporateSection = filteredEvents;
            this.filteredEvents= JSON.parse(JSON.stringify(this.corporateSection));
            this.allScheduledEvents=JSON.parse(JSON.stringify(this.corporateSection));
            break;

            case 'corporate_events_section':
            var today = new Date(this.datePipe.transform(new Date(),'yyyy-MM-dd')+' 00:00:00.000');
           
            let filteredMEvents  = prismic;
            filteredMEvents.items = prismic.items.filter(m =>{
              let date;
              if(m.from_date != null){
                m.date = m.from_date;
                m.display_date =  this.datePipe.transform(new Date(m.from_date),'d MMM y');
                date = new Date(this.datePipe.transform(new Date(m.from_date),'yyyy-MM-dd')+' 00:00:00.000');
              }
          
              if(m.to_date != null){
                m.date = m.to_date;
                let endDate = new Date(this.datePipe.transform(new Date(m.to_date),'yyyy-MM-dd')+' 00:00:00.000');
                if(date < endDate){
                  m.display_date =  this.datePipe.transform(new Date(date),'d') +' - ' + this.datePipe.transform(new Date(m.to_date),'d MMM y');
                  date = endDate;
                }                  
              }
              return today <= date;
            });

            filteredMEvents?.items.sort((a, b) => ((new Date(a.date) < new Date(b.date)) ? -1 : 1));
            this.corporateSection = filteredMEvents;
            this.filteredEvents= JSON.parse(JSON.stringify(this.corporateSection));
            this.allScheduledEvents=JSON.parse(JSON.stringify(this.corporateSection));
            break;


            case 'corporate_upcoming_events_section':
              this.upcomingCorporate=prismic
              this.upcomingSection = prismic;
            break;
              case 'upcoming_shows_section':
              this.upcomingShows=prismic
              break;
              case 'social_proof_section':
                this.socialProofSection = prismic;
                break;
          default:
            console.log("type:", prismic)
        }
      })
      this.commonMtd.addMetaTag(seoSection, ogSection, twitterSection);
    }).bind(this), function (err) {
      console.log("Something went wrong: ", err);
    });
  }

 imgClick(event){
   let temp = JSON.parse(JSON.stringify(this.allScheduledEvents))
   let list = this.allScheduledEvents.items.filter(ele => ele.type == event.type);
   temp.items = list;
   let title = (temp?.primary?.title!=null)?temp.primary.title:'';
   temp.primary.title = event.type + " " + title.toLowerCase().replace("all", "");
   this.filteredEvents = temp;
   }

   onClick(tab){
     this.page = 1;
    this.upcomingSection = null;
     if(tab==1){
      this.upcomingSection = JSON.parse(JSON.stringify(this.upcomingCorporate));
      this.filteredEvents= JSON.parse(JSON.stringify(this.corporateSection));
      this.allScheduledEvents=JSON.parse(JSON.stringify(this.corporateSection));
     }
     else{
      this.upcomingSection = JSON.parse(JSON.stringify(this.upcomingShows));
      this.filteredEvents= JSON.parse(JSON.stringify(this.showsSection));
      this.allScheduledEvents=JSON.parse(JSON.stringify(this.showsSection));
     }
     }

   getUpcomingEvents(events){
    
   }
    
}
