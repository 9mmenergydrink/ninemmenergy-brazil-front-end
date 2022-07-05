import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalStudiesInnerComponent } from './clinical-studies-inner.component';

describe('ClinicalStudiesInnerComponent', () => {
  let component: ClinicalStudiesInnerComponent;
  let fixture: ComponentFixture<ClinicalStudiesInnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClinicalStudiesInnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicalStudiesInnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
