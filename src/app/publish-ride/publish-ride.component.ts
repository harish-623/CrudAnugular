import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-publish-ride',
  templateUrl: './publish-ride.component.html',
  styleUrls: ['./publish-ride.component.css']
})
export class PublishRideComponent {
  leavingFrom: string = '';
  goingTo: string = '';
  date: string = '';
  time: string = '';
  passengerLimit: number = 1;
  carType: string = '';
  amount: number = 0;
  contactNumber: string = '';
  riderName: string = 'Rider1'; // or fetch from login

  constructor(private http: HttpClient) {}

  publishRide() {
    if (!this.leavingFrom || !this.goingTo || !this.date || !this.time) {
      alert('Please fill all required fields');
      return;
    }

    const payload = {
  riderName: this.riderName,
  fromLocation: this.leavingFrom,   // map to backend key
  toLocation: this.goingTo,         // map to backend key
  rideDate: this.date,               // map to backend key
  rideTime: this.time,               // map to backend key
  passengerLimit: this.passengerLimit,
  amount: this.amount,
  carType: this.carType,
  phoneNumber: this.contactNumber    // map to backend key
};


    console.log(payload)
    const driverId = localStorage.getItem('driverId');
    
    console.log(driverId)
    const url = `http://localhost:8095/login/publish/${driverId}`;
    this.http.post(url, payload)
      .subscribe({
        next: (res: any) => {
          alert('Ride Published Successfully!');
          this.clearForm();
        },
        error: (err) => console.error(err)
      });
  }

  clearForm() {
    this.leavingFrom = '';
    this.goingTo = '';
    this.date = '';
    this.time = '';
    this.passengerLimit = 1;
    this.carType = '';
    this.amount = 0;
    this.contactNumber = '';
  }
    

  
}
