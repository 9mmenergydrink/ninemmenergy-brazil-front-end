import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Prismic from 'prismic-javascript';
import { Subscription } from 'rxjs';
import { CommonMethods } from 'src/app/common/common-methods';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment.prod';
import { prismicEnConstants } from 'src/app/common/prismic-Enconstants';
import { prismicFrConstants } from 'src/app/common/prismic-Frconstants';
import { CommonMethodsService } from 'src/app/shared/common-methods/common-methods.service';

@Component({
  selector: 'app-read-more',
  templateUrl: './read-more.component.html',
  styleUrls: ['./read-more.component.css']
})
export class ReadMoreComponent implements OnInit {
  headerSection: any;
  footerSection: any;
  seoSection;
  ogSection;
  contentTitle;
  backRt;
  readMoreSection;
  common;
  constant: any;
  langkey: any;
  cartCount;// = JSON.parse(localStorage.getItem('cartCount'));
  constructor(private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder,
    private service: ApiService, private toastr: ToastrService, private commonMtd: CommonMethodsService) {
    this.cartCount = commonMtd.getCartCountDetails();
    commonMtd.addIndexMeta();
    this.common = new CommonMethods(router);
    this.contentTitle = (this.route.snapshot.params['title'] != null) ? this.route.snapshot.params['title'] : "";
    this.backRt = this.contentTitle;
  }

  ngOnInit(): void {
    if(localStorage.getItem('language') == 'fr'){
      this.constant = prismicFrConstants
      this.langkey = 'fr-fr'
    }else{
      this.constant = prismicEnConstants
      this.langkey = 'en-us'
    }
    this.getPrismicDatas()
  }

  backPage() {
    this.common.navigate('/' + this.backRt);
  }

  getPrismicDatas() {
    let documentId = "";
    let caseName = "read_more_section";
    if (this.contentTitle != "" && this.contentTitle == "about") {
      documentId =this.constant['aboutId']
    }
    else if (this.contentTitle != "" && (this.contentTitle == "events")) {
      documentId =this.constant['eventsId'];
    }else if (this.contentTitle != "" && this.contentTitle == "shop") {
      documentId = this.constant['shopId'];
    }else if (this.contentTitle != "" && this.contentTitle == "whats-act") {
      documentId =this.constant['whatsActId'];
    }else if (this.contentTitle != "" && this.contentTitle == "brain-workout") {
      documentId = this.constant['brainWorkoutId'];
    }else if (this.contentTitle != "" && this.contentTitle == "blog") {
      documentId = this.constant['blogId'];
    } else if (this.contentTitle != "" && this.contentTitle == "contact") {
      documentId =this.constant['contactId'];
    }else if (this.contentTitle != "" && this.contentTitle.includes("home-slide")) {
      documentId = this.constant['homeDataId'];
      caseName += "_" + this.contentTitle.split("-")[1];
      this.backRt ="";
    }
    else {
      return;
    }
    // let id = this.constant['brainWorkoutId']
    let lang = this.langkey
    return Prismic.api("https://9mmenergydrink.prismic.io/api/v2").then(function (api) {
      return api.query(Prismic.Predicates.at('document.id', documentId),{ lang : lang});
    }).then((function (response) {

      response.results[0]?.data?.body.forEach(prismic => {
        switch (prismic.slice_label) {
          case 'seosection':
            this.seoSection = prismic;
            break;
          case 'ogsection':
            this.ogSection = prismic;
            break;
          case caseName:
            this.readMoreSection = prismic;
            break;
            default:
            console.log("read_more_section:", prismic);
        }
      })
    }).bind(this), function (err) {
      console.log("Something went wrong: ", err);
    });

  }

  socialShare(media) {
    switch (media) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${environment.uiUrl}read-morer?title=${this.contentTitle}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?source=tweetbutton&url=${environment.uiUrl}read-more?title=${this.contentTitle}`);
        break;
      case 'pinterest':
        window.open(`https://www.pinterest.com/pin/create/button/?url=${environment.uiUrl}read-more?title=${this.contentTitle}`);
        break;
      case 'instagram':
        window.open(`https://www.instagram.com/9mmenergydrink1/`);
        // window.open(`https://instagram.com/accounts/login/?text=%20Check%20up%20this%20awesome%20content?url=${environment.uiUrl}blog-inner/${this.contentTitle}`);   
        break;
      default:
        break;
    }
  }

}
