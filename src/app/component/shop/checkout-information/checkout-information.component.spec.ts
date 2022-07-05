import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutInformationComponent } from './checkout-information.component';

describe('CheckoutInformationComponent', () => {
  let component: CheckoutInformationComponent;
  let fixture: ComponentFixture<CheckoutInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckoutInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
