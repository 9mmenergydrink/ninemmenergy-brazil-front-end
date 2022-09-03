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
  page = 1;
  pageSize = 2;
  public showHideDetail = 'Show Details';
  public showHideTrackOrder = 'Showtrackorder';
  orderGroup: FormGroup;
  orderDetails;
  address;
  searchTerm: string = "";
  cartCount;
  cartDetails;

  @Input() set orderData(val: any) {
    if (val && !val?.errors && !val?.status) {
      this.orderDetails = val;
      console.log("this.orderDetails", this.orderDetails)
    }else{
      if(val?.status == 500){
        this.toastr.error("Internal server error");        
      }else if(val){
        this.toastr.error("Please contact support");
      }
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
    if(this.orderGroup.get("ordersearch").value){
      this.pageChanged(this.orderGroup.get("ordersearch").value);
    }else{
      this.orderDetails = Object.assign({}, this.prevOrderDetails);
      this.isSearchData = false;
    }
  }

  prevPage = 1;
  isSearchData = false;
  prevOrderDetails = null;
  disableSearchInputBox = false;
  pageChanged(searchByName?) {
    this.disableSearchInputBox = true;
    let pageNo;
    let pageCount = "first:1";
    if(!searchByName){
      this.isSearchData = false;
      searchByName = 'null';
     if(this.prevPage < this.page){
        let lastOrderId = this.orderDetails?.edges[this.orderDetails?.edges.length-1]?.node?.id?.replace('gid://shopify/Order/', '');
        pageNo = 'after:"' + window.btoa(JSON.stringify({"last_id":parseInt(lastOrderId),"last_value":parseInt(lastOrderId)}))  + '"';
        pageCount = "first:2";
      }else{
        let firstOrderId = this.orderDetails?.edges[0]?.node?.id?.replace('gid://shopify/Order/', '');
        pageNo = 'before:"' + window.btoa(JSON.stringify({"last_id":parseInt(firstOrderId),"last_value":parseInt(firstOrderId)}))  + '"';
        pageCount = "last:2";
      }
    }else{
      this.isSearchData = true;
      pageNo = "after:null";
      searchByName = searchByName?("name:"+searchByName.replaceAll('#','')):'null';
    }
    
    this.prevPage = this.page;
    this.apiService.isLoading.next(true);
    this.apiService.getOrderDetailbyAdminGraphiql(this.orderDetails?.customerId, pageNo, pageCount, searchByName).subscribe((res: any) => {
      if (res.status === "7400" && res?.value?.data?.customer?.orders) {
        if(searchByName && searchByName != 'null'){
          if(!this.prevOrderDetails)
             this.prevOrderDetails = Object.assign({}, this.orderDetails);
          if(!res?.value?.data?.customer?.orders?.edges?.length)
          this.orderDetails.edges = null;
          else{
            res.value.data.customer.orders.customerId = this.orderDetails?.customerId;
          this.orderDetails = JSON.parse(JSON.stringify(res?.value?.data?.customer?.orders));
          }
        }else{
          this.prevOrderDetails = null;
          res.value.data.customer.orders.customerId = this.orderDetails?.customerId;
          this.orderDetails = JSON.parse(JSON.stringify(res?.value?.data?.customer?.orders));
        }
      }else{
        this.orderDetails = null;
      }
      this.apiService.isLoading.next(false);
      this.disableSearchInputBox = false;
    }, err => {
      this.orderDetails = null;
      this.apiService.isLoading.next(false);
    })
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
    this.apiService.isLoading.next(true);
    if (order?.node?.lineItems?.edges[0]?.node) {
      this.serviceReOrder(order, order?.node?.lineItems?.edges[0]?.node, 0)
    }
  }

  serviceReOrder(order, item, index) {
    if(item?.node) 
    item = item?.node;
    let cartDetails;
    let cartCount;
    let id = item?.variant?.id?.replace('gid://shopify/ProductVariant/', '');
    this.apiService.getVariantList(id).subscribe((res: any) => {
      if (res?.status == "7400") {
        let product = {
          quantity: item?.quantity,
          title: item?.title,
          variantId: id,
          selectedPlanDet: (item?.sellingPlan?.sellingPlanId) ? item?.selectedPlan : null
        }
        let productImage = {
          src: item?.variant?.image?.url,
          alt: item?.variant?.image?.altText
        }
        let variants = {
          inventory_quantity: res?.value[0]?.inventory_quantity,
          inventory_policy: res?.value[0]?.inventory_policy,
          title: res?.value[0]?.title,
          id: res?.value[0]?.id,
          planPrice: item?.price,
          price: res?.value[0]?.price,
          admin_graphql_api_id: res?.value[0]?.admin_graphql_api_id
        };

        if (res?.value[0]?.inventory_policy == 'deny') {
          if (res?.value[0]?.inventory_quantity < 1) {
            //inventory quantity is zero
            this.toastr.error(item?.title + " - " + res?.value[0]?.title + " " + this.translate.instant('outOfStock'), this.translate.instant('error'));
            this.apiService.isLoading.next(false);
            return;
          } else if ((item?.quantity) > res?.value[0]?.inventory_quantity) {
            //quantity exceeds inventory quantity
            this.toastr.error(this.translate.instant('all') + item?.title + " - " + res?.value[0]?.title + this.translate.instant('areInYourCart'), this.translate.instant('error'));
            this.apiService.isLoading.next(false);
            return;
          }
        }

        let userEmail = localStorage.getItem('email');
        let cartDet = this.commonMtd.checkEmpty(JSON.parse(localStorage.getItem('cartDetails')), []);

        if (userEmail != null) {
          let cartDetList = cartDet.find(item => (item?.email == userEmail));
          let res = this.commonMtd.getCartList(cartDetList, variants, item?.quantity, product, this.toastr, productImage);
          if (res?.cartDetList && res?.prevCount) {
            let cartDetailIndex = cartDet.findIndex(item => (item?.email == userEmail));
            if (cartDetailIndex != null && cartDetailIndex > -1) {
              cartDet[cartDetailIndex] = {
                email: userEmail, list: res?.cartDetList, countDetails: res?.prevCount,
                cartId: (cartDet[cartDetailIndex]?.cartId) ? cartDet[cartDetailIndex].cartId : null, isNew: true
              };
            } else {
              cartDet.push({ email: userEmail, list: res?.cartDetList, countDetails: res?.prevCount, isNew: true });
            }
            localStorage.setItem('cartDetails', JSON.stringify(cartDet));
            cartCount = res?.prevCount;
            cartDetails = res?.cartDetList;
          }
        }
      }
      let i = index + 1;
      if (index == order?.node?.lineItems?.edges?.length - 1) {
        this.apiService.isLoading.next(false);
        let modalRef = this.modalService.open(AddToCartComponent, { windowClass: "custom-class", scrollable: true });
        modalRef.result.then((data) => {
          cartCount = JSON.parse(JSON.stringify(this.commonMtd.getCartCountDetails()));
        }, (reason) => {
          cartCount = JSON.parse(JSON.stringify(this.commonMtd.getCartCountDetails()));
        })
      }
      else if (i <= order?.node?.lineItems?.edges?.length - 1) {
        this.serviceReOrder(order, order?.node?.lineItems?.edges[i], i)
      }
    }, err => {
      if (index == order?.node?.lineItems?.edges?.length - 1) {
        this.apiService.isLoading.next(false);
      }
    })
  }

  trackYourOrder(order){
    this.apiService.isLoading.next(true);
    let id = order?.id?.replace('gid://shopify/Order/', '');
    this.apiService.getOrderStatusUrl(id).subscribe((res: any) => {
      if (res?.status === "7400" && res?.value?.order_status_url) {
        window.open(res?.value.order_status_url,'_blank');
      }else{
        this.toastr.error("Please contact support");
      }
      this.apiService.isLoading.next(false);
    }, err => {
      this.toastr.error("Internal server error");
      this.apiService.isLoading.next(false);
    })
  }

  cancelModal(order) {
    this.commonMtd.cancelOrder.next(order);
    let modalRef = this.modalService.open(CancelOrderComponent, { centered: true, windowClass: 'cancel-order-window'});
  }

  ngOnDestroy() {
    this.modalService.dismissAll();
  }
}
