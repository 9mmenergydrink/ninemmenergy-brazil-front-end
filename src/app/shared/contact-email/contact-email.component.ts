import { Component, Input,OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-contact-email',
  templateUrl: './contact-email.component.html',
  styleUrls: ['./contact-email.component.css']
})
export class ContactEmailComponent implements OnInit {



  constructor(public activeModal: NgbActiveModal, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

}
