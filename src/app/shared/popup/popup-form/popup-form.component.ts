import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
declare let $:any;
@Component({
  selector: 'app-popup-form',
  templateUrl: './popup-form.component.html',
  styleUrls: ['./popup-form.component.css']
})
export class PopupFormComponent implements OnInit {

  
  ctaUrl;
  @Input() set script(script: any) {
    this.ctaUrl = null;
    if (script) {
    console.log("Script ", script);
    $("#bookAppointmentId").append(script);
    // this.ctaUrl = script;
    }
  }

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
