import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbModal ,ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';
import { CommonMethodsService } from 'src/app/shared/common-methods/common-methods.service';

@Component({
  selector: 'app-profile-pwd',
  templateUrl: './profile-pwd.component.html',
  styleUrls: ['./profile-pwd.component.css']
})
export class ProfilePwdComponent implements OnInit {
  subScription;
  password;
  npassword;
  email;
  phone;
  passError = false;
  isEditName = false;
  isEditPass = false;
  isEditEmail = false;
  isUpdateEmail = false;
  isEditPhone = false;
  isUpdatePhone = false;
  closeResult = '';
  formGroup;
  
  profileDetails;
  @Input() set profile(val: any) {
    if (val != null) {
      this.profileDetails = val;
    }
  }  
 
 constructor(public translate: TranslateService,private modalService: NgbModal,
  private apiService: ApiService, private formBuilder: FormBuilder, private toastr: ToastrService, 
  private commonMtd:CommonMethodsService) {
  translate.use(localStorage.getItem('language'));
  }

  ngOnInit(): void {  
    this.formGroup = this.formBuilder.group({    
      'first_name':[this.profileDetails.firstName, Validators.required],
      'last_name':[this.profileDetails.lastName, Validators.required]
    });
  }

  onClickCancel(){
     this.clear();
  }

  onClickSave(){
    if (this.formGroup.invalid) {
      for (const control of Object.keys(this.formGroup.controls)) {
        this.formGroup.controls[control].markAsTouched();
      }
      return;
    } else if (this.formGroup.valid){
      this.formGroup.value.id = this.profileDetails.id;
      if(this.formGroup.value.oldPassword){
        this.verifyOldPass({email:this.profileDetails.email, password:this.formGroup.value.oldPassword});
      }else{
        this.updateUser(this.formGroup.value);
      }
    
    }
  }

  clear(){
    this.formGroup.reset();
    this.passError = false;
    this.isEditName = false;
    this.isEditEmail = false;
    this.isEditPhone = false;
    this.isEditPass = false;
  }

  verifyOldPass(data) {
    this.apiService.isLoading.next(true);
    this.apiService.customerLogin(data).subscribe((res: any) => {
     if (res?.status === "7400" && res?.value?.accessToken)
    {
        this.passError = false;
        this.updateUser(this.formGroup.value);
      }else{
        this.passError = true;
      }
      this.apiService.isLoading.next(false);
    })
  }

  updateUser(data) {
    this.apiService.isLoading.next(true);
    this.subScription = this.apiService.updateAccount(data).subscribe((res: any) => {
      if (res.status === "7400") {
        this.updateProfileLocal(data);
        this.clear();
      }else
        this.toastr.error(res.message, this.translate.instant('error'));
      this.apiService.isLoading.next(false);
    }, err => {
      this.apiService.isLoading.next(false);
    })
  }

  updateProfileLocal(data){

    if(data.first_name || data.last_name){
   if(data.first_name){
    this.profileDetails.firstName = data.first_name;
   }

   if(data.last_name){
    this.profileDetails.lastName = data.last_name;
   }

   let nameObj = this.commonMtd.getShortName(data);
   this.profileDetails.shortName = nameObj.shortName.toUpperCase();
   localStorage.setItem("profile", JSON.stringify(this.profileDetails));
   this.apiService.userShortName.next(nameObj.shortName.toUpperCase());
   //this.cartCount = JSON.parse(localStorage.getItem('cartCount'));
   this.toastr.success(this.translate.instant('nameUpdate'),this.translate.instant('toastrSuccess'));
  }
   
   
   if(data.email){
    this.profileDetails.email = data.email;
    this.toastr.success(this.translate.instant('eamilUpdated'),this.translate.instant('toastrSuccess'));
   }

   if(data.phone){
    this.profileDetails.phone = data.phone;
    this.toastr.success(this.translate.instant('phoneUpdated'),this.translate.instant('toastrSuccess'));
   }

   if(data.password){
    this.toastr.success(this.translate.instant('passwordUpdated'),this.translate.instant('toastrSuccess'));
   }
  }

  get f() {
    return this.formGroup.controls;
  }

  onClickEdit(btn){
    this.clear();
    if(btn == 1){
      this.isEditName = true;
   this.formGroup = this.formBuilder.group({    
    'first_name':[this.profileDetails.firstName, Validators.required],
    'last_name':[this.profileDetails.lastName, Validators.required]
  });
    }else if(btn == 2){
      this.isEditEmail = true;
      this.formGroup = this.formBuilder.group({ 
        'email':[this.profileDetails.email,Validators.compose([Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")])]
      });
    }else if(btn == 3){
      this.isEditPhone = true;
      this.formGroup = this.formBuilder.group({ // ("^[0-9]*$")
        'phone':[null, Validators.compose([Validators.required,Validators.pattern('^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$')])]
      });
    }else if(btn == 4){
      this.isEditPass = true;
      this.formGroup = this.formBuilder.group({    
        'password': [null, Validators.compose([Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')])],
        'oldPassword': [null, Validators.required],
      });
    } 

  }

  onClickToInput(){
   this.isUpdateEmail = true;
  }
  // onClickEmailVerify(content) {
  //     this.modalService.open(content,{ centered: true, windowClass: 'emailverify-popup'});
  // }
  onClickEmailVerify(content) {
    this.modalService.open(content,{ centered: true, windowClass: 'emailverify-popup'});
  }

  onClickPhoneVerify(ContentPhone) {
    this.modalService.open(ContentPhone,{ centered: true, windowClass: 'phoneverify-popup'});
  }
  onClickToPhoneInput(){
   this.isUpdatePhone = true;
  }

}
