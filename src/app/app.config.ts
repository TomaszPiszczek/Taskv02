import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseChartDirective  } from 'ng2-charts';

import { routes } from './app.routes';
import { ViewSimulationComponent } from './view-simulation/view-simulation/view-simulation.component';
import { NewSimulationComponent } from './new-simulation/new-simulation/new-simulation.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { MySimulationsComponent } from './my-simulations/my-simulations/my-simulations.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideClientHydration(),
    CommonModule,
    ReactiveFormsModule,
    BaseChartDirective ,
    ViewSimulationComponent,
    NewSimulationComponent,
    DashboardComponent,
    MySimulationsComponent,
  ]
};
