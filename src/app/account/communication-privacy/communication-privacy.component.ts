import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import {TranslateService} from '@ngx-translate/core';
import { CommonMethods } from 'src/app/common/common-methods';
import { Router } from '@angular/router';
import { prismicEnConstants } from 'src/app/common/prismic-Enconstants';
import { prismicFrConstants } from 'src/app/common/prismic-Frconstants';
import { CommonMethodsService } from 'src/app/shared/common-methods/common-methods.service';

@Component({
  selector: 'app-communication-privacy',
  templateUrl: './communication-privacy.component.html',
  styleUrls: ['./communication-privacy.component.css']
})
export class CommunicationPrivacyComponent implements OnInit {
  common;
  constant: any;
  langkey: any;

  constructor(private apiService: ApiService, public router: Router, public translate: TranslateService,
    private commonMtd: CommonMethodsService) {    
    commonMtd.addIndexMeta();
    this.common = new CommonMethods(router);  translate.use(localStorage.getItem('language'));
}

  ngOnInit(): void {
    if(localStorage.getItem('language') == 'fr'){
      this.constant = prismicFrConstants
      this.langkey = 'fr-fr'
    }else{
      this.constant = prismicEnConstants
      this.langkey = 'en-us'
    }
  }

}
