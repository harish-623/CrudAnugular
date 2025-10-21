
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-ride-details',
  templateUrl: './ride-details.component.html',
  styleUrls: ['./ride-details.component.css']
})
export class RideDetailsComponent {

  

  rideId!: number;
  ride: any 

  constructor(private route: ActivatedRoute, private http: HttpClient,private authService: AuthService) {}

  ngOnInit(): void {
    // Get ride ID from route parameters
    // this.rideId = this.route.snapshot.paramMap.get('rideId') || '';
    this.rideId = +this.route.snapshot.paramMap.get('id')!;
    console.log(this.rideId)
    this.getRideDetails();
  }

  getRideDetails() {
    this.http.get<any>(`http://localhost:8095/login/${this.rideId}`)
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
  }

}
