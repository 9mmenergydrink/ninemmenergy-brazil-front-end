import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddToCartComponent } from './add-to-cart/add-to-cart.component';
import { FormsModule } from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import { VideoPopupComponent } from './popup/video-popup/video-popup.component';
import { ContactEmailComponent } from './contact-email/contact-email.component';
import { CancelOrderComponent } from './cancel-order/cancel-order.component';
import { PopupFormComponent } from './popup/popup-form/popup-form.component';
import { AlphaSpaceDirective } from './directives/alpha-space/alpha-space.directive';
import { NumericDirective } from './directives/numeric/numeric.directive';




@NgModule({
  declarations: [AddToCartComponent, VideoPopupComponent, ContactEmailComponent,CancelOrderComponent, PopupFormComponent, AlphaSpaceDirective, NumericDirective],
  imports: [
    TranslateModule.forRoot(),
    CommonModule,
    FormsModule
  ],
  exports:[AddToCartComponent, CancelOrderComponent, AlphaSpaceDirective, NumericDirective]
})
export class SharedModule { }