import { Component, OnInit } from '@angular/core';
import { SimulationService, Simulation } from '../../services/simulation.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-simulations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-simulations.component.html',
  styleUrls: ['./my-simulations.component.css'],
})
export class MySimulationsComponent implements OnInit {
  simulations: Simulation[] = [];
  loading: boolean = true;
  error: string | null = null;
  editIndex: number | null = null;
  editFormErrors: { [key: string]: string } = {};
  editedSimulation: Simulation = {
    id: '',
    name: '',
    populationSize: 0,
    initialInfectedCount: 0,
    reproductionRate: 0,
    mortalityRate: 0,
    recoveryTime: 0,
    mortalityTime: 0,
    simulationDuration: 0,
  };

  constructor(
    private simulationService: SimulationService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.simulationService.getSimulations().subscribe(
      (data) => {
        this.simulations = data;
        this.loading = false;
      },
      (error) => {
        this.error = 'Failed to load simulations.';
        this.loading = false;
        console.error(error);
      }
    );
  }

  editSimulation(simulation: Simulation, index: number) {
    if (this.editIndex === index) {
      this.editIndex = null;
    } else {
      this.editIndex = index;
      this.editedSimulation = { ...simulation };
      this.validateEditForm();
    }
  }

  showResults(simulation: Simulation) {
    this.router.navigate(['/view-simulation'], {
      state: { simulationId: simulation.id },
    });
  }
  validateEditForm() {
    this.editFormErrors = {};
    const { initialInfectedCount, populationSize, reproductionRate } = this.editedSimulation;

    const initialInfectedCountNum = Number(initialInfectedCount);
    const populationSizeNum = Number(populationSize);
    const reproductionRateNum = Number(reproductionRate);

    if (initialInfectedCountNum >= populationSizeNum) {
        this.editFormErrors['initialInfectedCount'] = 'Initial Infected Count must be less than Population Size.';
    }
    if (reproductionRateNum * initialInfectedCountNum >= populationSizeNum) {
        this.editFormErrors['reproductionRate'] = 'Reproduction Rate times Initial Infected Count must be less than Population Size.';
    }
}

  isEditFormValid(): boolean {
    return Object.keys(this.editFormErrors).length === 0;
  }

  submitEdit() {
    if (this.editedSimulation && this.isEditFormValid()) {
      const url = `http://localhost:8080/api/v1/simulations`;
      this.http.put(url, this.editedSimulation).subscribe(
        (response) => {
          console.log('Simulation updated successfully:', response);
          if (this.editIndex !== null) {
            this.simulations[this.editIndex] = { ...this.editedSimulation };
          }
          this.editIndex = null;
        },
        (error) => {
          console.error('Failed to update simulation:', error);
          this.error = 'Failed to update simulation.';
        }
      );
    }
  }
}
