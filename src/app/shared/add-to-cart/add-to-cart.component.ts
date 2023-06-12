import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { CommonMethods } from 'src/app/common/common-methods';
import { CommonMethodsService } from '../common-methods/common-methods.service';

@Component({
  selector: 'app-add-to-cart',
  templateUrl: './add-to-cart.component.html',
  styleUrls: ['./add-to-cart.component.css']
})
export class AddToCartComponent implements OnInit {
  cartCount;// = JSON.parse(localStorage.getItem('cartCount'));
  cartDetails = [];// = JSON.parse(localStorage.getItem('cartDetails'));

  product: any;
  productImage = '';
  quantity = 1;
  variants;
  common;
  cartData;

  constructor(public translate: TranslateService,public activeModal: NgbActiveModal, public router: Router,
    public commonMtd: CommonMethodsService, private toastr: ToastrService) {
    this.common = new CommonMethods(router);
    
  }

  ngOnInit(): void {

    let cartData = this.commonMtd.getCurrentCartDetails();
    if (cartData?.index != null && cartData.index > -1 && cartData?.cartDetailsList && cartData?.cartDetailsList[cartData.index]) {
      this.cartData = cartData;
      this.cartCount = cartData.cartDetailsList[cartData.index].countDetails;
      this.cartDetails = JSON.parse(JSON.stringify(cartData.cartDetailsList[cartData.index].list));
    }
  }

  onClickClose(data, i) {
    let prevCount = JSON.parse(JSON.stringify(this.cartCount));
    if (prevCount.qCount >= data.quantity)
      prevCount.qCount -= data.quantity;
    if (prevCount.pCount >= 1)
      prevCount.pCount -= 1;
    let subTotal = parseFloat(prevCount.subTotal) - (data.price * data.quantity);
    prevCount.subTotal = (subTotal).toFixed(2);
    if (prevCount.subTotal < 0) {
      prevCount.subTotal = 0;
    }
    this.cartDetails.splice(i, 1);
    if (this.cartData?.index != null && this.cartData.index > -1 && this.cartData?.cartDetailsList && this.cartData?.cartDetailsList[this.cartData.index]) {
      this.cartData.cartDetailsList[this.cartData.index].countDetails = prevCount;
      this.cartData.cartDetailsList[this.cartData.index].list = this.cartDetails;
      // localStorage.setItem('cartCount', JSON.stringify(prevCount));
      localStorage.setItem('cartDetails', JSON.stringify(this.cartData.cartDetailsList));
    }
    this.cartCount = prevCount;
  }

  onClick(router) {
    if(this.cartCount?.pCount > 0){
      const lineItems = [];

      this.cartDetails.forEach(item => {
        lineItems.push({
          //variantId: btoa(item.variantsGraphqlId),//For create checkout. Commented for currently not used create checkout process
          quantity: item.quantity,
          //for create cart
          merchandiseId: btoa(btoa(item.variantsGraphqlId)),
          attributes: []
        })
      });
      this.commonMtd.createCart(lineItems, this.cartData.cartDetailsList, this.cartData.index);
      // this.common.onClick(router, this.product, this.variants, this.quantity, this.productImage);    
    }else{
      
      this.toastr.error(this.translate.instant('emptyCartCheckout'));
      return;
    }
  }

  onClickViewCart() {
    // this.router.navigateByUrl("/cart-page");
    this.common.navigate(this.commonMtd.getRoutePath('cart'));
  }

}
