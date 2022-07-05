import { Component, Input, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { TranslateService } from '@ngx-translate/core';

let self;
@Component({
  selector: 'app-delivery-address',
  templateUrl: './delivery-address.component.html',
  styleUrls: ['./delivery-address.component.css']
})

export class DeliveryAddressComponent implements OnInit {
  @ViewChild('stateSelect') stateSelectElement: ElementRef;
  @ViewChild('countrySelect') countrySelectElement: ElementRef;
  addresses;
  customerId;
  @ViewChild('check') checkElement: ElementRef;

  @Input() set address(val: any) {
    if (val && val.addresses) {
      this.addresses = val.addresses;
      this.customerId = val.customerId;
    }
  }

  @Input() set countries(val: any) {
    if (val) {
      this.countryList = val;
    }
  }
  
  formGroup: FormGroup;
  isAddEditAddress = false;
  subScription;
  stateList = [];
  countryList = [];
  selectedIndex;

 constructor(public translate: TranslateService, private apiService: ApiService, private toastr: ToastrService, public renderer: Renderer2) {
  self = this;
  }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      'id': new FormControl(null),
      'first_name': new FormControl(null, [Validators.required]),
      'last_name': new FormControl(null, [Validators.required]),
      'address1': new FormControl(null, [Validators.required]),
      'address2': new FormControl(null),
      'city': new FormControl(null, [Validators.required]),
      'country': new FormControl(null, [Validators.required]),
      'province': new FormControl(null, [Validators.required]),
      'zip': new FormControl(null, Validators.compose([Validators.required, this.validateZipCode.bind(this)])),
      
      'default': new FormControl(false),
      'phone': new FormControl(null, Validators.compose([Validators.required,Validators.pattern('^[- +()0-9]*$')]))
    });
  }

  ngAfterViewInit() {
    //To set placeholders for Country and State --start here
        let getStateElement = this.stateSelectElement.nativeElement as HTMLSelectElement;
        let stateOptionValue = getStateElement.selectedIndex;
        let getCountryElement = this.countrySelectElement.nativeElement as HTMLSelectElement;
        let countryOptionValue = getCountryElement.selectedIndex;
        if(stateOptionValue == -1 && countryOptionValue == 0){
          this.stateSelectElement.nativeElement.classList.add("dd-placeholder");
          this.countrySelectElement.nativeElement.classList.add("dd-placeholder");
        }
    //To set placeholders for Country and State --end here
  }
  get f() {
    return this.formGroup.controls;
  }

  validateZipCode(controls) {
    if (controls.value != null && controls.value != "" && self.formGroup) {
      if (self.formGroup.value.country == null || self.formGroup.value.country.shortName == null) {
        return { 'countryEmpty': true };
      } else if (self.formGroup.value.province == null || self.formGroup.value.province == '') {
        return { 'stateEmpty': true };
      } else {
        self.apiService.getZipCodeDetail(self.formGroup.value.country.shortName, controls.value).subscribe((res: any) => {
          console.log('res:', res);
          let found = false;
          res?.result?.forEach(data => {
            if (data.state == self.formGroup.value.province) {
              found = true;
              this.formGroup.get('zip').errors.invalidCode = false;
              this.formGroup.get('zip').setErrors(null);
              return { 'invalidCode': false };
            }
          })
          if (found) {
            this.formGroup.get('zip').errors.invalidCode = false;
            this.formGroup.get('zip').setErrors(null);
            return { 'invalidCode': false };
          } else {
            this.formGroup.get('zip').errors.invalidCode = true;
            return { 'invalidCode': true };
          }
        }, err => {
          console.log('error:', err);
          this.formGroup.get('zip').errors.invalidCode = true;
          return { 'invalidCode': true };
        })
        return { 'invalidCode': true };
      }
    } else {
      return { 'invalidCode': false };
    }
  }

  onChangeCountry() {
    this.formGroup.get('zip').errors.countryEmpty = null;
    this.getStates(null,this.formGroup.value.country.shortName);
  }

  onChangeState() {
    this.formGroup.get('zip').errors.stateEmpty = null;
  }
  
  onClickEdit(address, index){
    this.getStates(address);
    this.selectedIndex = index;
    this.isAddEditAddress = true;
    this.formGroup.patchValue(address);
  }

  checkIsDefault(){
    if(this.formGroup.get('default').value){
      this.toastr.error(this.translate.instant('addressChange'));
      this.renderer.setAttribute(this.checkElement, 'disabled', 'true');
    }
  }

  getStates(address, countryCode?) {
    if(!countryCode){
      countryCode = address.country_code;
    }
    this.apiService.isLoading.next(true);
    this.subScription = this.apiService.getStates(countryCode).subscribe((res: any) => {
      console.log('state res', res);
      if (res.status === "7400") {
        this.stateList = res.value;        
          let country = this.countryList.find(item=>item.shortName==countryCode);
          this.formGroup.get('country').setValue(country); 
          if(address?.province)
          this.formGroup.get('province').setValue(address.province);
      }
      //else
      //this.toastr.error(res.message, "Error");
      this.apiService.isLoading.next(false);
    }, err => {
      this.apiService.isLoading.next(false);
    })
  }

  onClickRemove(address, index){
    if(!address.default){
      this.apiService.isLoading.next(true);
      address.customerId = this.customerId;
      this.subScription = this.apiService.deleteAccountAddress(address).subscribe((res: any) => {
        if (res.status === "7400") {
          this.addresses.splice(index,1);
        }else
          this.toastr.error(res.message, this.translate.instant('error'));
        this.apiService.isLoading.next(false);
      }, err => {
        this.apiService.isLoading.next(false);
      })
    }else{
      this.toastr.error(this.translate.instant('addressRemoved'));
    }
  }

  onClickSave(){
    this.formGroup.value.customerId = this.customerId;
    this.formGroup.value.country = this.formGroup.value.country.name;
    this.apiService.isLoading.next(true);
    this.subScription = this.apiService.updateAccountAddress(this.formGroup.value).subscribe((res: any) => {
      if (res.status === "7400") {
        this.updateProfileLocal(res.message);
      }else
        this.toastr.error(res.message, this.translate.instant('error'));
      this.apiService.isLoading.next(false);
    }, err => {
      this.apiService.isLoading.next(false);
    })
  }

  updateProfileLocal(data){
    data.name = data.first_name + " " + data.last_name;
    if(data.id){
      if(this.selectedIndex != null && this.selectedIndex > -1){
        if(data.default && this.addresses.length > 0){
          this.addresses[0].default=false;
          this.addresses.splice(this.selectedIndex,1);
          this.addresses.unshift(data);
        }else{
          this.addresses[this.selectedIndex] = data;
        }  
      }else{
        if(data.default){
          if(this.addresses.length > 0)
          this.addresses[0].default=false;
          this.addresses.unshift(data);
        }else{
          this.addresses.push(data);
        }  
      }
    }
    this.onClickCancel();
  }

  onClickCancel(){
    this.selectedIndex = -1;
    this.isAddEditAddress = false;
    this.formGroup.reset();
    this.formGroup.get('default').setValue(false);
  }
}
