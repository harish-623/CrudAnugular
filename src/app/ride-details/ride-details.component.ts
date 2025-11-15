
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
<<<<<<< Updated upstream
=======
  selectedPassengers: number = 1;
  errorMessage: string = '';
>>>>>>> Stashed changes

  constructor(private route: ActivatedRoute, private http: HttpClient,private authService: AuthService,private router: Router) {}

  ngOnInit(): void {
    // Get ride ID from route parameters
    // this.rideId = this.route.snapshot.paramMap.get('rideId') || '';
    this.rideId = +this.route.snapshot.paramMap.get('id')!;
    console.log(this.rideId)
    this.getRideDetails();
  }

  getRideDetails() {
<<<<<<< Updated upstream
    this.http.get<any>(` https://spring-boot-crud-3qhx.onrender.com/login/${this.rideId}`)
=======
    this.http.get<any>(` http://localhost:8095/login/${this.rideId}`)
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
  const token = localStorage.getItem('userToken');

  if (!token) {
    alert("Please login to continue booking!");
    this.router.navigate(['/login']);
    return;
  }

=======
>>>>>>> Stashed changes
    if (!this.ride) {
    console.error('Ride details not loaded yet.');
    return;

  }
<<<<<<< Updated upstream
  

  // Check if user is logged in / registered
  // const currentUser = this.authService.getCurrentUser(); // Get user from a service
  // if (!currentUser) {
  //   alert('Please login or register to book a ride.');
  //   this.router.navigate(['/login']); // Redirect to login page
  //   return;
  // }

  const payload = {
    rideId: this.ride.id,
    riderName: this.ride.riderName,
    from: this.ride.from,
    to: this.ride.to,
    date: this.ride.date,
    time: this.ride.time,
    carType: this.ride.carType,
    passengerLimit: this.ride.passengerLimit,
    amount: this.ride.amount,
    phoneNumber: this.ride.phoneNumber
  };
  console.log(payload)
  this.http.post('http://localhost:8095/login/bookride', payload)
    .subscribe(
      (response) => {
        console.log('Ride booked successfully', response);
        alert('Ride booked successfully!');
      },
      (error) => {
        console.error('Error booking ride', error);
        alert('Failed to book ride.');
      }
    );
=======

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
    const url = `http://localhost:8095/login/book?rideId=${rideId}&passengerId=${passengerId}&seatsBooked=${seatsBooked}`;

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


    
  

  
 
>>>>>>> Stashed changes
  }

}
