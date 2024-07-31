import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { NewSimulationComponent } from './new-simulation/new-simulation/new-simulation.component';
import { MySimulationsComponent } from './my-simulations/my-simulations/my-simulations.component';
import { ViewSimulationComponent } from './view-simulation/view-simulation/view-simulation.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent},
  { path: 'new-simulation', component: NewSimulationComponent },
  { path: 'my-simulations', component: MySimulationsComponent },
  { path: 'view-simulation', component: ViewSimulationComponent }, 
  { path: 'dashboard', component: DashboardComponent }
];
