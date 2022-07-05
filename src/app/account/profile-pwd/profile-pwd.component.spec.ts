import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilePwdComponent } from './profile-pwd.component';

describe('ProfilePwdComponent', () => {
  let component: ProfilePwdComponent;
  let fixture: ComponentFixture<ProfilePwdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfilePwdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePwdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
