import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-driver-publish-rides',
  templateUrl: './driver-publish-rides.component.html',
  styleUrls: ['./driver-publish-rides.component.css']
})
export class DriverPublishRidesComponent {

  user: any = {};
    rides: any[] = [];
    noResultsMessage: string = '';
    loading: boolean = true;
    driverId!: number; 
  
    rideCount: number = 0;
  
    constructor(
      private route: ActivatedRoute,
      private http: HttpClient,
      private router: Router,
    ) {}
  
    ngOnInit(): void {
      this.route.queryParams.subscribe(params => {
        // const driverIdParam  = params['driverId'];
        const driverIdParam=localStorage.getItem("driverId")
        console.log(driverIdParam)
        // const driverIdParam=14
        if (driverIdParam ) {
          this.driverId = +driverIdParam;
          console.log('driverID received:', this.driverId );
          this.fetchDriverRides(this.driverId);
          
        } else {
          this.noResultsMessage = 'No Publish Rides provided.';
          this.loading = false;
        }
      });
    }
  
    fetchDriverRides(driverId: number): void {
      // const apiUrl = `http://localhost:8095/login/driver/${driverId}`;

       const apiUrl =
  window.location.hostname === 'localhost'
    ? `http://localhost:8095/login/driver/${driverId}`
    : `https://api.vyropool.info/login/driver/${driverId}`;
  
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
            this.noResultsMessage = 'No rides found';
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


    viewDetails(rideId: number) {
        // this.router.navigate(['/view-details',]);
        this.router.navigate(['/view-details', rideId]);
        console.log(rideId)
        console.log(this.driverId)
    }
  
    cancelRide(rideId: number): void {
    if (confirm('Are you sure you want to cancel this ride?')) {
      const driverId = this.driverId;
      // const apiUrl = `http://localhost:8095/login/cancel/${rideId}/driver/${driverId}`;

      const apiUrl =
  window.location.hostname === 'localhost'
    ? `https://api.vyropool.info/login/cancel/${rideId}/driver/${driverId}`
    : `https://api.vyropool.info/login/cancel/${rideId}/driver/${driverId}`;
      this.http.put(apiUrl, { responseType: 'text' }).subscribe({
        next: (response) => {
          this.loading = false;
      alert(response); // now "Ride cancelled successfully" works!
      this.fetchDriverRides(driverId);
    },
    error: (err) => {
      console.error('Error cancelling ride:', err);
      alert('Error cancelling ride. Please try again.');
      this.loading = false;
    }
      });
    }
  }

  startRide(rideId: number)
  {
     this.router.navigate(['/start-ride', rideId]);
        console.log(rideId)
        console.log(this.driverId)
  }

   goHome() {
  this.router.navigate(['/home']);
}

}
