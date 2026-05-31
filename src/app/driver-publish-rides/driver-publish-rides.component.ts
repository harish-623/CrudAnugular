import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

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
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      // const driverIdParam  = params['driverId'];
      const driverIdParam = localStorage.getItem("driverId")
      console.log(driverIdParam)
      // const driverIdParam=14
      if (driverIdParam) {
        this.driverId = +driverIdParam;
        console.log('driverID received:', this.driverId);
        this.fetchDriverRides(this.driverId);

      } else {
        this.noResultsMessage = 'No Publish Rides provided.';
        this.loading = false;
      }
    });
  }

  showSuccess(message: string) {
    this.toastMessage = message;
    this.toastType = 'success';
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  showError(message: string) {
    this.toastMessage = message;
    this.toastType = 'error';
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  fetchDriverRides(driverId: number): void {
    const apiUrl = `${environment.apiUrl}/driver/${driverId}`;

    this.http.get<{ result: string; rideCount: number; rides: any[]; message: string }>(apiUrl).subscribe({
      next: (response: { result: string; rideCount: number; rides: any[]; message: string }) => {
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

  // cancelRide(rideId: number): void {
  //   if (confirm('Are you sure you want to cancel this ride?')) {
  //     const driverId = this.driverId;
  //     const apiUrl = `${environment.apiUrl}/cancel/${rideId}/driver/${driverId}`;
  //     this.http.put(apiUrl, { responseType: 'text' }).subscribe({
  //       next: (response) => {
  //         this.loading = false;
  //         alert(response);
  //         this.showSuccess('Successfully Cancelled Ride');

  //         this.fetchDriverRides(driverId);
  //       },
  //       error: (err) => {
  //         console.error('Error cancelling ride:', err);
  //         this.showError('Error cancelling ride. Please try again.');

  //         this.loading = false;
  //       }
  //     });
  //   }
  // }

  cancelRide(rideId: number): void {

  if (confirm('Are you sure you want to cancel this ride?')) {

    this.loading = true;

    const driverId = this.driverId;

    const apiUrl = `${environment.apiUrl}/cancel/${rideId}/driver/${driverId}`;

    this.http.put(apiUrl, {}, { responseType: 'text' }).subscribe({

      next: (response: string) => {

        console.log('Ride Cancel Response:', response);

        this.loading = false;

        alert(response);

        this.showSuccess('Successfully Cancelled Ride');

        // Refresh rides list
        this.fetchDriverRides(driverId);
      },

      error: (err) => {

        console.error('Error cancelling ride:', err);

        this.showError('Error cancelling ride. Please try again.');

        this.loading = false;
      }

    });
  }
}

  startRide(rideId: number) {
    this.router.navigate(['/start-ride', rideId]);
    console.log(rideId)
    console.log(this.driverId)
  }

  goHome() {
    this.router.navigate(['/home']);
  }

}
