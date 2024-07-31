import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

@Component({
  selector: 'app-view-simulation',
  templateUrl: './view-simulation.component.html',
  styleUrls: ['./view-simulation.component.css'],
})
export class ViewSimulationComponent implements OnInit {
  @ViewChild('chart', { static: false }) chart: any;
  public chartOptions: any;

  simulationData: any[] = [];
  healthyCount: number = 0;
  activeCases: number = 0;
  recoveredCount: number = 0;
  deathCount: number = 0;

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {
    // Retrieve the passed data from the router state
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { simulation: any[] };
    this.simulationData = state.simulation || [];

    this.updateStats(); // Calculate stats
  }

  async ngOnInit() {
    if (window !== undefined) {
    if (isPlatformBrowser(this.platformId)) {
      // Dynamically import ng-apexcharts only on the client-side
      const { ChartComponent, NgApexchartsModule } = await import('ng-apexcharts');
      
      const days = this.simulationData.map(data => `Day ${data.day}`);
      const healthyCounts = this.simulationData.map(data => data.healthyCount);
      const infectedCounts = this.simulationData.map(data => data.infectedCount);
      const recoveredCounts = this.simulationData.map(data => data.recoveredCount);
      const deceasedCounts = this.simulationData.map(data => data.deceasedCount);

      this.chartOptions = {
        series: [
          {
            name: 'Healthy',
            data: healthyCounts
          },
          {
            name: 'Infected',
            data: infectedCounts
          },
          {
            name: 'Recovered',
            data: recoveredCounts
          },
          {
            name: 'Deceased',
            data: deceasedCounts
          }
        ],
        chart: {
          type: 'bar',
          height: 350,
          stacked: true,
          stackType: '100%'
        },
        dataLabels: {
          enabled: false // Example default value, adjust as needed
        },
        plotOptions: {
          bar: {
            horizontal: false,
          },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              legend: {
                position: 'bottom',
                offsetX: -10,
                offsetY: 0
              }
            }
          }
        ],
        xaxis: {
          categories: days
        },
        fill: {
          opacity: 1
        },
        legend: {
          position: 'right',
          offsetX: 0,
          offsetY: 50
        }
      };
    }
  }
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
