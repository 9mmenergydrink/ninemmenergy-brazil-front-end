import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsActComponent } from './whats-act.component';

describe('WhatsActComponent', () => {
  let component: WhatsActComponent;
  let fixture: ComponentFixture<WhatsActComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhatsActComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatsActComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
