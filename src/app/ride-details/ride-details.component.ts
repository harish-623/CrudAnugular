
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ride-details',
  templateUrl: './ride-details.component.html',
  styleUrls: ['./ride-details.component.css']
})
export class RideDetailsComponent {



  rideId!: number;
  ride: any
  selectedPassengers: number = 1;
  errorMessage: string = '';
  loading: boolean = true;
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(private route: ActivatedRoute, private http: HttpClient, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {

    this.rideId = +this.route.snapshot.paramMap.get('id')!;
    console.log(this.rideId)
    this.getRideDetails();
  }

  getRideDetails() {

    //   const url  =
    // window.location.hostname === 'localhost'
    //   ?` https://api.vyropool.info/login/${this.rideId}` 
    //   : ` https://api.vyropool.info/login/${this.rideId}` 
    const url = `${environment.apiUrl}/${this.rideId}`

    this.http.get<any>(url)
      .subscribe(
        (response) => {
          this.loading = false;
          this.ride = response;
          console.log('Ride Details:', this.ride);
        },
        (error) => {
          console.error('Error fetching ride details:', error);

        }
      );
  }

  callRider() {
    if (this.ride?.phoneNumber) {
      window.open(`tel:${this.ride.phoneNumber}`);
    }
  }

  messageRider() {
    if (this.ride?.phoneNumber) {
      window.open(`sms:${this.ride.phoneNumber}`);
    }
  }

  showErrorAndRedirect(message: string) {
    this.toastMessage = message;
    this.toastType = 'error';
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
      this.router.navigate(['/login']); // 🔥 redirect
    }, 2500);
  }

  closeAlert() {
    this.showToast = false;
  }

  bookRide() {

    if (!this.ride) {
      console.error('Ride details not loaded yet.');
      return;
    }

    const passengerId = Number(localStorage.getItem('driverId')); // logged in user id
    const rideDriverId = this.ride.riderName.id  // driver who published ride

    if (passengerId === rideDriverId) {
      alert("🚫 Driver can't book their own ride!");

      return; // stop booking
    }

    if (!this.selectedPassengers || this.selectedPassengers <= 0) {
      console.error('⚠️ Please select the number of passengers.');
      return;
    }

    const token = localStorage.getItem('userToken');

    const rideId = this.rideId; // or this.ride.id depending on your object
    console.log(rideId)

    const seatsBooked = this.selectedPassengers;
    console.log(seatsBooked)



    const url = `${environment.apiUrl}/book?rideId=${rideId}&passengerId=${passengerId}&seatsBooked=${seatsBooked}`
    this.loading = true;
    this.http.post(url, {}).subscribe({
      next: (res: any) => {
        console.log(res)
        if (res.result === 'Success') {
          console.log('🎉', res.message);
          alert("Ride booked Successfully")
          this.router.navigate(['/home']);
        } else {
          console.log(res.result)
          alert(res.message)
          this.errorMessage = res.message || 'Booking failed. Please try again.';

        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error booking ride:', err);
        alert('Failed to book the ride. Please try again.');
        this.loading = false;
      }
    });
  }

  goHome() {
    this.router.navigate(['/home']);
  }

}
