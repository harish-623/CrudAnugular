
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

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

  constructor(private route: ActivatedRoute, private http: HttpClient,private authService: AuthService,private router: Router) {}

  ngOnInit(): void {
    // Get ride ID from route parameters
    // this.rideId = this.route.snapshot.paramMap.get('rideId') || '';
    this.rideId = +this.route.snapshot.paramMap.get('id')!;
    console.log(this.rideId)
    this.getRideDetails();
  }

  getRideDetails() {

    const url  =
  window.location.hostname === 'localhost'
    ?` http://localhost:8095/login/${this.rideId}` 
    : ` https://spring-boot-crud-3qhx.onrender.com/login/${this.rideId}` 

    this.http.get<any>(url)
      .subscribe(
        (response) => {
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

  bookRide(){

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
    const url  =
  window.location.hostname === 'localhost'
    ? `http://localhost:8095/login/book?rideId=${rideId}&passengerId=${passengerId}&seatsBooked=${seatsBooked}`
    : `https://spring-boot-crud-3qhx.onrender.com/login/book?rideId=${rideId}&passengerId=${passengerId}&seatsBooked=${seatsBooked}`;
    
    // const url = `http://localhost:8095/login/book?rideId=${rideId}&passengerId=${passengerId}&seatsBooked=${seatsBooked}`;

  this.http.post(url, {}).subscribe({
    next: (res: any) => {
      console.log(res)
      if (res.result === 'Success') {
          console.log('🎉', res.message);
          alert("Ride booked Successfully")
          this.router.navigate(['/home']);
        } else {
          this.errorMessage = res.message || 'Booking failed. Please try again.';
        }
    },
    error: (err) => {
      console.error('Error booking ride:', err);
      alert('Failed to book the ride. Please try again.');
    }
  });


    
  

  
 
  }

}
