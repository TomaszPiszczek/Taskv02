import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Simulation {
  id: string; 
  name: string;
  populationSize: number;
  initialInfectedCount: number;
  reproductionRate: number;
  mortalityRate: number;
  recoveryTime: number;
  mortalityTime: number;
  simulationDuration: number;
}

@Injectable({
  providedIn: 'root'
})
export class SimulationService {
  private apiUrl = 'http://localhost:8080/api/v1/simulations/';

  constructor(private http: HttpClient) {}

  getSimulations(): Observable<Simulation[]> {
    return this.http.get<Simulation[]>(this.apiUrl);
  }
}
