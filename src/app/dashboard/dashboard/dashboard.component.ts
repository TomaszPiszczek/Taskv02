import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  totalConfirmed: number = 0;
  totalRecovered: number = 0;
  totalDeaths: number = 0;
  activeCases: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchCovidData();
  }

  fetchCovidData() {
    /*const apiUrl = 'https://api.covid19api.com/summary';
    this.http.get(apiUrl).subscribe((data: any) => {
      this.totalConfirmed = data.Global.TotalConfirmed;
      this.totalRecovered = data.Global.TotalRecovered;
      this.totalDeaths = data.Global.TotalDeaths;
      this.activeCases = this.totalConfirmed - this.totalRecovered - this.totalDeaths;
    });*/
  }
}
