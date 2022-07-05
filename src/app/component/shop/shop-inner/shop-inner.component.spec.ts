import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopInnerComponent } from './shop-inner.component';

describe('ShopInnerComponent', () => {
  let component: ShopInnerComponent;
  let fixture: ComponentFixture<ShopInnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopInnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopInnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
