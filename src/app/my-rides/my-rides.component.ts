import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';


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
  selectedOtp: string | null = null;



  rideCount: number = 0;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const driverIdParam = params['driverId'];
      if (driverIdParam) {
        this.driverId = +driverIdParam;
        console.log('driverID received:', this.driverId);
        this.fetchDriverRides(this.driverId);
        this.rides.forEach((ride: any) => {
          this.getOtp(ride);
        });

      } else {
        this.noResultsMessage = 'No username provided.';
        this.loading = false;
      }
    });
  }

  fetchDriverRides(driverId: number): void {
    const apiUrl = `${environment.apiUrl}/myrides/${driverId}`;

    //   const apiUrl =
    // window.location.hostname === 'localhost'
    //   ? `https://api.vyropool.info/login/myrides/${driverId}`
    //   : `https://api.vyropool.info/login/myrides/${driverId}`;


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
            this.rides.forEach((ride: any) => {
              this.getOtp(ride);
            });

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
      const apiUrl = `${environment.apiUrl}/cancelRide/${bookingId}`;

      //   const apiUrl =
      // window.location.hostname === 'localhost'
      //   ? `https://api.vyropool.info/login/cancelRide/${bookingId}`
      //   : `https://api.vyropool.info/login/cancelRide/${bookingId}`;

      this.loading = true;

      this.http.put(apiUrl, {}).subscribe({
        next: (response: any) => {
          this.loading = false;
          alert(response.message);
          this.fetchDriverRides(this.driverId); // refresh rides after cancellation
        },
        error: (err) => {
          console.error('Error cancelling ride:', err);
          alert('Error cancelling ride. Please try again.');
          this.loading = false;
        }
      });
    }
  }

  getOtp(ride: any) {
    const url = `${environment.apiUrl}/ride/get-otp?bookingId=${ride.bookingId}`;
    console.log(url)
    this.http.get(url).subscribe({
      next: (res: any) => {
        if (res && res.otp) {
          ride.otpStatus = res.result;
          ride.otp = res.otp || null; // store OTP
          // console.log("OTP:", ride.otp);
        } else {
          // this.selectedOtp = "OTP not available";
          ride.otpStatus = 'OTP not available';
          ride.otp = null;
        }
      },
      error: (err) => {
        console.error("Error fetching OTP", err);
        ride.otpStatus = 'Error';
        ride.otp = null;
      }
    });
  }


  goHome() {
    this.router.navigate(['/home']);
  }



}