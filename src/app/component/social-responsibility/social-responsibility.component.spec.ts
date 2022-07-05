import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialResponsibilityComponent } from './social-responsibility.component';

describe('SocialResponsibilityComponent', () => {
  let component: SocialResponsibilityComponent;
  let fixture: ComponentFixture<SocialResponsibilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocialResponsibilityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialResponsibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
