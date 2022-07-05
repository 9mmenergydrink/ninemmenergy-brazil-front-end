import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteDisclaimerComponent } from './website-disclaimer.component';

describe('WebsiteDisclaimerComponent', () => {
  let component: WebsiteDisclaimerComponent;
  let fixture: ComponentFixture<WebsiteDisclaimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebsiteDisclaimerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebsiteDisclaimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
