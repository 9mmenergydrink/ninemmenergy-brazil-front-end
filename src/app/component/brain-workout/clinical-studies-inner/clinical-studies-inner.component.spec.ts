import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NeuroClinicalStudiesInnerComponent } from './clinical-studies-inner.component';



describe('NeuroClinicalStudiesComponent', () => {
  let component: NeuroClinicalStudiesInnerComponent;
  let fixture: ComponentFixture<NeuroClinicalStudiesInnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NeuroClinicalStudiesInnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NeuroClinicalStudiesInnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
