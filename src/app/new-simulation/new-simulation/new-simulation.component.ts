import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomValidators } from './custom-validators';

@Component({
  selector: 'app-new-simulation',
  templateUrl: './new-simulation.component.html',
  styleUrls: ['./new-simulation.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class NewSimulationComponent {
  simulationForm: FormGroup;
  apiError: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.simulationForm = this.fb.group({
      name: ['', Validators.required],
      populationSize: [0, [Validators.required, Validators.min(1)]],
      initialInfectedCount: [0, [Validators.required, Validators.min(1)]],
      reproductionRate: [0, [Validators.required, Validators.min(0)]],
      mortalityRate: [0, [Validators.required, Validators.min(0), Validators.max(1)]],
      recoveryTime: [0, [Validators.required, Validators.min(1)]],
      mortalityTime: [0, [Validators.required, Validators.min(1)]],
      simulationDuration: [0, [Validators.required, Validators.min(1)]]
    }, { 
      validators: [
        CustomValidators.initialInfectedLessThanPopulation(),
        CustomValidators.reproductionRateTimesInfectedLessThanPopulation()
      ]
    });
  }

  onSubmit(): void {
    if (this.simulationForm.valid) {
      this.http.post('http://localhost:8080/api/v1/simulations', this.simulationForm.value)
        .subscribe(
          (response: any) => {
            this.router.navigate(['/my-simulations']);
          },
          error => {
            this.apiError = true;
            console.error('Error creating simulation', error);
          }
        );
    }
  }
  
}
