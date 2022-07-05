import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.css']
})
export class PaymentMethodComponent implements OnInit {
  isCollapsed=true;
  giftcardclose=true;
  constructor() { }

  ngOnInit(): void {
  }

}
