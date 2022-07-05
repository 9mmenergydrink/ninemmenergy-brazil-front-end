import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsInsideComponent } from './whats-inside.component';

describe('WhatsInsideComponent', () => {
  let component: WhatsInsideComponent;
  let fixture: ComponentFixture<WhatsInsideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhatsInsideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhatsInsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
