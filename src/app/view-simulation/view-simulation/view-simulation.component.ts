import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-view-simulation',
  templateUrl: './view-simulation.component.html',
  styleUrls: ['./view-simulation.component.css'],
  standalone: true,
  imports: [CommonModule] // Include CommonModule here
})
export class ViewSimulationComponent {
  simulationData: any[] = [];
  healthyCount: number = 0;
  activeCases: number = 0;
  recoveredCount: number = 0;
  deathCount: number = 0;

  constructor(private router: Router) {
    // Retrieve the passed data from the router state
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { simulation: any[] };
    this.simulationData = state.simulation || [];

    this.updateStats(); // Calculate stats
  }

  // Method to update the statistics based on the last day of the simulation
  updateStats(): void {
    if (this.simulationData.length > 0) {
      const lastDay = this.simulationData[this.simulationData.length - 1];
      this.healthyCount = lastDay.healthyCount;
      this.recoveredCount = lastDay.recoveredCount;
      this.deathCount = lastDay.deceasedCount;
      this.activeCases = lastDay.infectedCount; // Total infected cases are the active cases
    }
  }
}
