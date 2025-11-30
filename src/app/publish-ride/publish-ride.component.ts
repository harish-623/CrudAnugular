import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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

  loading: boolean = false; // ✅ loader flag
  fromSuggestions: any[] = [];
  toSuggestions: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}
  goHome() {
  this.router.navigate(['/home']);
}

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
    // const url = `http://localhost:8095/login/publish/${driverId}`;
    const url =
  window.location.hostname === 'localhost'
    ? `http://localhost:8095/login/publish/${driverId}`
    : `https://spring-boot-crud-3qhx.onrender.com/login/publish/${driverId}`;
    this.loading = true;
    this.http.post(url, payload)
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          alert('Ride Published Successfully!');
          // this.router.navigate(['/home'], { queryParams: { driverId } });
          this.router.navigate(['/my-publish-rides'])
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
    

  searchPlaces(query: string, type: 'from' | 'to') {
    if (query.length < 2) return;
    
    // const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}
    &addressdetails=1&limit=5&countrycodes=in&accept-language=en`;


    
    this.http.get<any[]>(url).subscribe((data) => {
    const formattedData = data.map(place => {
      const { city, town, village, state } = place.address;
      const formattedName = `${city || town || village || place.display_name}, ${state ?? ''}`;
      return { ...place, formattedName };
    });

    if (type === 'from') this.fromSuggestions = formattedData;
    else this.toSuggestions = formattedData;
  });
  }

  selectPlace(place: string, type: 'from' | 'to') {
    if (type === 'from') {
      this.leavingFrom = place;
      this.fromSuggestions = [];
    } else {
      this.goingTo = place;
      this.toSuggestions = [];
    }
  }

  
}
