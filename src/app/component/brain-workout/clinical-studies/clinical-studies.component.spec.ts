import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NeuroClinicalStudiesComponent } from './clinical-studies.component';



describe('NeuroClinicalStudiesComponent', () => {
  let component: NeuroClinicalStudiesComponent;
  let fixture: ComponentFixture<NeuroClinicalStudiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NeuroClinicalStudiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NeuroClinicalStudiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
