import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSimulationComponent } from './view-simulation.component';

describe('ViewSimulationComponent', () => {
  let component: ViewSimulationComponent;
  let fixture: ComponentFixture<ViewSimulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewSimulationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
