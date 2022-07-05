import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-video-popup',
  templateUrl: './video-popup.component.html',
  styleUrls: ['./video-popup.component.css']
})
export class VideoPopupComponent implements OnInit {

  videoUrl:any = "";

  @Input() set setVideoUrl(val: any) {
    if (val)
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(val);
  }
  
  
  constructor(public activeModal: NgbActiveModal, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
   // 
  }

}
