import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { CommonMethodsService } from '../common-methods/common-methods.service';

@Component({
  selector: 'app-cancel-order',
  templateUrl: './cancel-order.component.html',
  styleUrls: ['./cancel-order.component.css']
})
export class CancelOrderComponent implements OnInit {
  selectedReason: any;
  orderDetails;
  reasonList = [{ name: "Customer", value: "customer" }, { name: "Inventory", value: "inventory" }, { name: "Fraud", value: "fraud" }, { name: "Declined", value: "declined" }, { name: "Other", value: "other" }];
  constructor(public translate: TranslateService,public activeModal: NgbActiveModal, private toastr: ToastrService, private apiService: ApiService, public commonMtd: CommonMethodsService) {
    commonMtd.cancelOrder.subscribe((v) => {
      this.orderDetails = v;
    });
  }

  ngOnInit(): void {
    this.selectedReason = this.reasonList[0];
  }

  cancelReason() {
    this.apiService.isLoading.next(true);
    let object = {
      "orderId": this.orderDetails.id,
      "email": "true",
      "reason": this.selectedReason.value
    }

    this.apiService.getCancelOrder(object).subscribe((res: any) => {
      console.log("plist:", res);
      if (res.status === "7400") {
        if (res.value != null) {
          console.log(res.value);
          this.toastr.success(this.translate.instant('ordreCancel'));
          this.activeModal.close('Close click');
          this.commonMtd.cancelSuccess.next(true);
        }
      } else {

      }
      this.activeModal.close('Close click');
      this.apiService.isLoading.next(false);
    }, err => {
      this.apiService.isLoading.next(false);
    })
  }

}