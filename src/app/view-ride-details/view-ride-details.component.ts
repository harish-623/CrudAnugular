
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-view-ride-details',
  templateUrl: './view-ride-details.component.html',
  styleUrls: ['./view-ride-details.component.css']
})
export class ViewRideDetailsComponent {
rideId!: number;
passengers: any[] = [];
ride: any = {}; 

driverId!: number;
loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}



  ngOnInit() {
  this.rideId = Number(this.route.snapshot.paramMap.get('rideId'));
  const driverIdParam = Number(localStorage.getItem("driverId"));
  this.driverId = driverIdParam;
  this.loadPassengerData();
}

loadPassengerData() {
    this.loading = true;

    const url = `https://api.vyropool.info/login/ride/${this.rideId}/driver/${this.driverId}/passengers`;

    this.http.get(url).subscribe({
      next: (res: any) => {
        
        this.passengers = res.passengers || [];
        this.loading = false;
      },
      error: (err) => {
        console.error("Error fetching passengers", err);
        this.loading = false;
      }
    });
  }
  goBack() {
  this.router.navigate(['/my-publish-rides']);
}
}
