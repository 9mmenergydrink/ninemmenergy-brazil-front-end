import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { CommonMethodsService } from 'src/app/shared/common-methods/common-methods.service';
import { AddToCartComponent } from 'src/app/shared/add-to-cart/add-to-cart.component';
import { CancelOrderComponent } from 'src/app/shared/cancel-order/cancel-order.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  public showHideDetail = 'Show Details';
  public showHideTrackOrder = 'Showtrackorder';
  orderGroup: FormGroup;
  orderDetails;
  address;
  searchTerm: string = "";
  cartCount;
  cartDetails;

  @Input() set order(val: any) {
    if (val) {
      this.orderDetails = val;
    }
  }

  constructor(public translate: TranslateService, private modalService: NgbModal, private toastr: ToastrService, private commonMtd: CommonMethodsService, private apiService: ApiService) { 
    this.cartCount = commonMtd.getCartCountDetails();
  }

  ngOnInit(): void {
    /* console.log(this.order);
    this.order = JSON.parse(this.order);
    console.log(this.order);
    this.address = this.order?.addresses;
    console.log(this.address) */
    this.orderGroup = new FormGroup({
      'ordersearch': new FormControl(''),
    });
  }

  searchInput() {
    this.searchTerm = this.orderGroup.get("ordersearch").value;
  }

  // get show and hide details click event
  openDetail(order) { 
    order.showDetails = order.showDetails?!order.showDetails:true;
    //this.orderDetails.orderList[index] = JSON.parse(JSON.stringify(this.orderDetails.orderList[index]));
   
   // this.showHideDetail = this.showHideDetail === 'Show Details' ? 'Hide Details' : 'Show Details';
  }

  // get show and hide track order click event
  prevSTOIndex;
  trackorderopenDetail(order) {
      order.showTrackOrder = order.showTrackOrder?!order.showTrackOrder:true;
    //  this.orderDetails.orderList[index] = JSON.parse(JSON.stringify(this.orderDetails.orderList[index]));
   // this.showHideTrackOrder = this.showHideTrackOrder === 'Showtrackorder' ? 'Hidetrackorder' : 'Showtrackorder';
  }

  reOrder(order) {
    console.log('#####orders#####', order);
    const rLineItems = [];
    console.log('#####rLineItems#####', rLineItems);
    this.apiService.isLoading.next(true);
    if (order?.line_items?.length > 0) {
      this.serviceReOrder(order, order.line_items[0], 0)
    }
  }

  serviceReOrder(order, item, index) {
    this.apiService.getVariantList(item.variant_id).subscribe((res: any) => {
      if (res?.status == "7400") {
        console.log('#####res#####', res);
        let product = {
          quantity: item.quantity,
          title: item.title,
          variantId: item.variant_id,
          selectedPlanDet: (item.sellingPlan?.planid) ? item.selectedPlan : null
        }
        let productImage = {
          src: item.image,
          alt: item.alt
        }
        let variants = {
          inventory_quantity: res.value[0].inventory_quantity,
          inventory_policy: res.value[0].inventory_policy,
          title: res.value[0].title,
          id: res.value[0].id,
          planPrice: item.price,
          price: res.value[0].price,
          admin_graphql_api_id: res.value[0].admin_graphql_api_id
        };

        if (res.value[0].inventory_policy == 'deny') {
          if (res.value[0].inventory_quantity < 1) {
            //inventory quantity is zero
            this.toastr.error(item.title + " - " + res.value[0].title + this.translate.instant('outOfStock'), this.translate.instant('error'));
            this.apiService.isLoading.next(false);
            return;
          } else if ((item.quantity) > res.value[0].inventory_quantity) {
            //quantity exceeds inventory quantity
            this.toastr.error(this.translate.instant('all') + item.title + " - " + res.value[0].title + this.translate.instant('areCart'), this.translate.instant('error'));
            this.apiService.isLoading.next(false);
            return;
          }
        }

        let userEmail = localStorage.getItem('email');
        let cartDet = this.commonMtd.checkEmpty(JSON.parse(localStorage.getItem('cartDetails')), []);
        console.log('#####cartDet#####', cartDet);

        if (userEmail != null) {
          let cartDetList = cartDet.find(item => (item?.email == userEmail));
          let res = this.commonMtd.getCartList(cartDetList, variants, item.quantity, product, this.toastr, productImage);
          if (res?.cartDetList && res?.prevCount) {
            let cartDetailIndex = cartDet.findIndex(item => (item?.email == userEmail));
            if (cartDetailIndex != null && cartDetailIndex > -1) {
              cartDet[cartDetailIndex] = {
                email: userEmail, list: res.cartDetList, countDetails: res.prevCount,
                cartId: (cartDet[cartDetailIndex]?.cartId) ? cartDet[cartDetailIndex].cartId : null, isNew: true
              };
            } else {
              cartDet.push({ email: userEmail, list: res.cartDetList, countDetails: res.prevCount, isNew: true });
            }
            // localStorage.setItem('cartCount', JSON.stringify(prevCount));
            localStorage.setItem('cartDetails', JSON.stringify(cartDet));
            this.cartCount = res.prevCount;
            this.apiService.cartCount.next(this.cartCount.qCount);
            this.cartDetails = res.cartDetList;
          }
        }
      }
      let i = index + 1;
      if (index == order.line_items.length - 1) {
        this.apiService.isLoading.next(false);
        let modalRef = this.modalService.open(AddToCartComponent, { windowClass: "custom-class", scrollable: true });
          //modalRef.componentInstance.cartDetails = cartDetails;
          modalRef.result.then((data) => {
            // console.log("on close");
            this.cartCount = JSON.parse(JSON.stringify(this.commonMtd.getCartCountDetails()));
          }, (reason) => {
            // console.log("on dismiss");
            this.cartCount = JSON.parse(JSON.stringify(this.commonMtd.getCartCountDetails()));
          })
      }
      else if (i <= order.line_items.length - 1) {
        this.serviceReOrder(order, order.line_items[i], i)
      }
    }, err => {
      if (index == order.line_items.length - 1) {
        this.apiService.isLoading.next(false);
      }
    })
  }

  cancelModal(order) {
    console.log("cancel order ", order);
    // this.cancelOrder = order;
    this.commonMtd.cancelOrder.next(order);
    let modalRef = this.modalService.open(CancelOrderComponent, { centered: true, windowClass: 'cancel-order-window'});
  }

  ngOnDestroy() {
    this.modalService.dismissAll();
  }
}
