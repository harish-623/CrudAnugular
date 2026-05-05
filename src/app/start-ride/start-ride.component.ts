import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-start-ride',
  templateUrl: './start-ride.component.html',
  styleUrls: ['./start-ride.component.css']
})
export class StartRideComponent {


  rideId!: number;
  passengers: any[] = [];
  ride: any = {};

  driverId!: number;
  loading = true;
  errorMessage = '';
  otpVerified = false;
  rideStatus = ''
  otp = ''

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,

  ) { }



  ngOnInit() {
    this.rideId = Number(this.route.snapshot.paramMap.get('rideId'));
    const driverIdParam = Number(localStorage.getItem("driverId"));
    this.driverId = driverIdParam;
    this.loadPassengerData();
  }

  loadPassengerData() {
    this.loading = true;

    // const url = `https://api.vyropool.info/login/ride/${this.rideId}/driver/${this.driverId}/passengers`;
    const url = `${environment.apiUrl}/ride/${this.rideId}/driver/${this.driverId}/passengers`;
    this.http.get(url).subscribe({
      next: (res: any) => {

        this.passengers = res.passengers || [];
        console.log(res.passengers)
        this.passengers.forEach((p: any) => {
          this.checkOtpStatus(p);
        });
        this.loading = false;
      },
      error: (err) => {
        console.error("Error fetching passengers", err);
        this.loading = false;
      }
    });
  }

  checkOtpStatus(p: any) {
    // const url = `https://api.vyropool.info/login/ride/check-otp-status?bookingId=${p.bookingId}`;
    const url = `${environment.apiUrl}/ride/check-otp-status?bookingId=${p.bookingId}`;

    this.http.get<any>(url).subscribe(
      (response) => {
        console.log("OTP Status Check:", response);

        if (response.result === "Verified") {
          p.otpVerified = true;   // UI should show verified state
        } else {
          p.otpVerified = false;  // UI shows OTP input
        }
      },
      (error) => {
        console.error("Check OTP Status Error:", error);
        p.otpVerified = false;
      }
    );
  }




  verifyRideOtp(bookingId: string, enterOtp: string) {
    console.log(enterOtp)
    if (!enterOtp) {
      alert("Please enter OTP.");
      return;
    }

    // const url = `https://api.vyropool.info/login/ride/verify-otp?bookingId=${bookingId}&otp=${enterOtp}`;
    const url = `${environment.apiUrl}/ride/verify-otp?bookingId=${bookingId}&otp=${enterOtp}`;
    console.log(url)
    this.http.post<any>(url, {}).subscribe(
      (response) => {

        if (response.result === "Success") {
          // OTP Correct – Start Ride
          this.otpVerified = true;
          this.rideStatus = "otp-verified";

          alert("OTP Verified! Ride Started Successfully.");

        } else if (response.result === "Failed") {
          // OTP Failed or Already Verified
          this.otpVerified = false;

          alert(response.message);
        }
      },
      (error) => {
        console.error("OTP Verify Error:", error);
        alert("Something went wrong. Try again.");
      }
    );
  }




  goBack() {
    this.router.navigate(['/my-publish-rides']);
  }
}
