import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunicationPrivacyComponent } from './communication-privacy.component';

describe('CommunicationPrivacyComponent', () => {
  let component: CommunicationPrivacyComponent;
  let fixture: ComponentFixture<CommunicationPrivacyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommunicationPrivacyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunicationPrivacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
