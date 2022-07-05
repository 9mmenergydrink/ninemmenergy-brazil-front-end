import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrainWorkoutComponent } from './brain-workout.component';

describe('BrainWorkoutComponent', () => {
  let component: BrainWorkoutComponent;
  let fixture: ComponentFixture<BrainWorkoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrainWorkoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrainWorkoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
