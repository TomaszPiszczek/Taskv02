import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-view-simulation',
  templateUrl: './view-simulation.component.html',
  styleUrls: ['./view-simulation.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule] 
})
export class ViewSimulationComponent implements OnInit {
  simulationData: any[] = [];
  displayedData: any[] = [];
  displayedDataLine: any[] = []; 
  healthyCount: number = 0;
  activeCases: number = 0;
  recoveredCount: number = 0;
  deathCount: number = 0;
  chartData: { label: string, infected: number, healthy: number, deceased: number, recovered: number }[] = [];
  labelData: string[] = [];
  lineChartData: { day: string, infected: number, healthy: number, deceased: number, recovered: number }[] = [];
  infectedColor: string = '#0000FF';
  healthyColor: string = '#00FF00';
  deceasedColor: string = '#FF0000';
  recoveredColor: string = '#FFA500';
  currentPage: number = 0;
  currentPageLine: number = 0; 
  readonly pageSize: number = 30;
  displayedDays: number = 10; 
  displayedDaysLine: number = 10; 
  maxDays: number = 30; 
  private myChart: Chart | null = null;
  private myLineChart: Chart | null = null;
  private isMouseOverChart: boolean = false; 
  private isMouseOverLineChart: boolean = false; 

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const simulationId = history.state.simulationId;
    if (simulationId) {
      this.fetchSimulationData(simulationId);
    }
  }

  fetchSimulationData(simulationId: string): void {
    const url = `http://localhost:8080/api/v1/simulations/results/${simulationId}`;
    this.http.get<any[]>(url).subscribe(
      (data) => {
        this.simulationData = data;
        this.maxDays = this.simulationData.length; 
        this.updateStats();
        this.updateDisplayedData();
        this.updateDisplayedDataLine(); 
      },
      (error) => {
        console.error('Failed to fetch simulation data:', error);
      }
    );
  }

  updateStats(): void {
    if (this.simulationData.length > 0) {
      const lastDay = this.simulationData[this.simulationData.length - 1];
      this.healthyCount = lastDay.healthyCount;
      this.recoveredCount = lastDay.recoveredCount;
      this.deathCount = lastDay.deceasedCount;
      this.activeCases = lastDay.infectedCount;
    }
  }

  updateDisplayedData(): void {
    const start = this.currentPage * this.pageSize;
    const end = start + this.displayedDays; 
    this.displayedData = this.simulationData.slice(start, end);
    this.updateChartData();
  }

  updateDisplayedDataLine(): void {
    const start = this.currentPageLine * this.pageSize;
    const end = start + this.displayedDaysLine; 
    this.displayedDataLine = this.simulationData.slice(start, end);
    this.updateLineChartData();
  }

  updateChartData(): void {
    this.labelData = [];
    this.chartData = [];

    this.displayedData.forEach(dayData => {
      this.labelData.push(`Day ${dayData.day}`);
      this.chartData.push({
        label: `Day ${dayData.day}`,
        infected: dayData.infectedCount,
        healthy: dayData.healthyCount,
        deceased: dayData.deceasedCount,
        recovered: dayData.recoveredCount
      });
    });

    this.renderChart(this.labelData, this.chartData);
  }

  updateLineChartData(): void {
    this.lineChartData = this.displayedDataLine.map(dayData => ({
      day: `Day ${dayData.day}`,
      infected: dayData.infectedCount,
      healthy: dayData.healthyCount,
      deceased: dayData.deceasedCount,
      recovered: dayData.recoveredCount
    }));

    this.renderLineChart(this.lineChartData);
  }

  renderChart(labels: string[], data: { label: string, infected: number, healthy: number, deceased: number, recovered: number }[]): void {
    if (this.myChart) {
      this.myChart.destroy();
    }

    this.myChart = new Chart('barchart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Infected Count',
            data: data.map(d => d.infected),
            backgroundColor: this.infectedColor,
            borderColor: this.infectedColor,
            borderWidth: 1
          },
          {
            label: 'Healthy Count',
            data: data.map(d => d.healthy),
            backgroundColor: this.healthyColor,
            borderColor: this.healthyColor,
            borderWidth: 1
          },
          {
            label: 'Deceased Count',
            data: data.map(d => d.deceased),
            backgroundColor: this.deceasedColor,
            borderColor: this.deceasedColor,
            borderWidth: 1
          },
          {
            label: 'Recovered Count',
            data: data.map(d => d.recovered),
            backgroundColor: this.recoveredColor,
            borderColor: this.recoveredColor,
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            stacked: true, 
          },
          y: {
            stacked: true, 
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                const datasetLabel = tooltipItem.dataset.label || '';
                const value = tooltipItem.raw;
                return `${datasetLabel}: ${value}`;
              }
            }
          }
        }
      }
    });
  }

  renderLineChart(data: { day: string, infected: number, healthy: number, deceased: number, recovered: number }[]): void {
    if (this.myLineChart) {
      this.myLineChart.destroy();
    }

    this.myLineChart = new Chart('linechart', {
      type: 'line',
      data: {
        labels: data.map(d => d.day),
        datasets: [
          {
            label: 'Infected Count',
            data: data.map(d => d.infected),
            borderColor: this.infectedColor,
            fill: false
          },
          {
            label: 'Healthy Count',
            data: data.map(d => d.healthy),
            borderColor: this.healthyColor,
            fill: false
          },
          {
            label: 'Deceased Count',
            data: data.map(d => d.deceased),
            borderColor: this.deceasedColor,
            fill: false
          },
          {
            label: 'Recovered Count',
            data: data.map(d => d.recovered),
            borderColor: this.recoveredColor,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                const datasetLabel = tooltipItem.dataset.label || '';
                const value = tooltipItem.raw;
                return `${datasetLabel}: ${value}`;
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Days'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Count'
            }
          }
        }
      }
    });
  }

  onWheelBarChart(event: WheelEvent): void {
    if (event.deltaY > 0) {
      this.displayedDays = Math.min(this.displayedDays + 1, this.maxDays);
    } else {
      this.displayedDays = Math.max(this.displayedDays - 1, 1);
    }
    this.updateDisplayedData();

    event.preventDefault();
    event.stopPropagation();
  }

  onWheelLineChart(event: WheelEvent): void {
    if (event.deltaY > 0) {
      this.displayedDaysLine = Math.min(this.displayedDaysLine + 1, this.maxDays);
    } else {
      this.displayedDaysLine = Math.max(this.displayedDaysLine - 1, 1);
    }
    this.updateDisplayedDataLine();

    event.preventDefault();
    event.stopPropagation();
  }

  onMouseEnterChart(): void {
    this.isMouseOverChart = true;
  }

  onMouseLeaveChart(): void {
    this.isMouseOverChart = false;
  }

  onMouseEnterLineChart(): void {
    this.isMouseOverLineChart = true;
  }

  onMouseLeaveLineChart(): void {
    this.isMouseOverLineChart = false;
  }

  @HostListener('window:wheel', ['$event'])
  onWindowScroll(event: WheelEvent): void {
    if (this.isMouseOverChart) {
      this.onWheelBarChart(event);
    }
    if (this.isMouseOverLineChart) {
      this.onWheelLineChart(event);
    }
  }

  previousDays(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updateDisplayedData();
    }
  }

  nextDays(): void {
    if ((this.currentPage + 1) * this.pageSize < this.simulationData.length) {
      this.currentPage++;
      this.updateDisplayedData();
    }
  }

  previousDaysLine(): void {
    if (this.currentPageLine > 0) {
      this.currentPageLine--;
      this.updateDisplayedDataLine();
    }
  }

  nextDaysLine(): void {
    if ((this.currentPageLine + 1) * this.pageSize < this.simulationData.length) {
      this.currentPageLine++;
      this.updateDisplayedDataLine();
    }
  }
}