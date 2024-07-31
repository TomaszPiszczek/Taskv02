import { Component, OnInit } from '@angular/core';
import { SimulationService, Simulation } from '../../services/simulation.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // Import Router for navigation

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
    private router: Router // Add Router to constructor
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
    const url = `http://localhost:8080/api/v1/simulations/results/${simulation.id}`;
    this.http.get(url).subscribe(
      (resultData: any) => {
        // Navigate to the ViewSimulationComponent with the fetched data
        this.router.navigate(['/view-simulation'], {
          state: { simulation: resultData },
        });
      },
      (error) => {
        console.error('Failed to fetch simulation results:', error);
        this.error = 'Failed to fetch simulation results.';
      }
    );
  }

  validateEditForm() {
    this.editFormErrors = {};
    if (this.editedSimulation.initialInfectedCount >= this.editedSimulation.populationSize) {
      this.editFormErrors['initialInfectedCount'] = 'Initial Infected Count must be less than Population Size.';
    }
    if (this.editedSimulation.reproductionRate * this.editedSimulation.initialInfectedCount >= this.editedSimulation.populationSize) {
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
