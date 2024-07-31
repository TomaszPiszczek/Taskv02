import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MySimulationsComponent } from './my-simulations.component';

describe('MySimulationsComponent', () => {
  let component: MySimulationsComponent;
  let fixture: ComponentFixture<MySimulationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MySimulationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MySimulationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
