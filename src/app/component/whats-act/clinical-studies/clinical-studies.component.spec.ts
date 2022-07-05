import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalStudiesComponent } from './clinical-studies.component';

describe('ClinicalStudiesComponent', () => {
  let component: ClinicalStudiesComponent;
  let fixture: ComponentFixture<ClinicalStudiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClinicalStudiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicalStudiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
