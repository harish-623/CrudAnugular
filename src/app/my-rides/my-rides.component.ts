import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-my-rides',
  templateUrl: './my-rides.component.html',
  styleUrls: ['./my-rides.component.css']
})
export class MyRidesComponent implements OnInit {

  user: any = {};
  rides: any[] = [];
  noResultsMessage: string = '';
  loading: boolean = true;
  driverId!: number; 

  rideCount: number = 0;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const driverIdParam  = params['driverId'];
      if (driverIdParam ) {
        this.driverId = +driverIdParam;
        console.log('driverID received:', this.driverId );
        this.fetchDriverRides(this.driverId);
        
      } else {
        this.noResultsMessage = 'No username provided.';
        this.loading = false;
      }
    });
  }

  fetchDriverRides(driverId: number): void {
    const apiUrl = `http://localhost:8095/login/myrides/${driverId}`;

    this.http.get<{result: string; rideCount: number; rides: any[]; message: string }>(apiUrl).subscribe({
      next: (response: {result: string; rideCount:number; rides:any[]; message:string}) => {
        console.log('Backend Response:', response);
        console.log(response.result)
        console.log(response.message)
        console.log(response.rideCount)
        if (response.result === 'Success') {
          this.rideCount = response.rideCount || 0;

          if (response.rideCount > 0 && response.rides && response.rides.length > 0) {
            this.rides = response.rides;
            this.noResultsMessage = '';
          } else {
            this.noResultsMessage = response.message || 'No rides found.';
            this.rides = [];
          }
        } else {
          this.noResultsMessage = 'Failed to retrieve rides.';
        }

        this.loading = false;
      
      },
      error: (error) => {
        console.error('Error fetching rides:', error);
        this.noResultsMessage = 'Error fetching driver rides.';
        this.loading = false;
      }
    });
  }

  cancelRide(bookingId: number): void {
  if (confirm('Are you sure you want to cancel this ride?')) {
    const apiUrl = `http://localhost:8095/login/cancelRide/${bookingId}`;

    this.http.put(apiUrl, {}).subscribe({
      next: (response: any) => {
        alert(response.message);
        this.fetchDriverRides(this.driverId); // refresh rides after cancellation
      },
      error: (err) => {
        console.error('Error cancelling ride:', err);
        alert('Error cancelling ride. Please try again.');
      }
    });
  }
}
  
  
  
}