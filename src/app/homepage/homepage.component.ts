import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {

  places: string[] = [
  'Hyderabad',
  'Gachibowli',
  'Aram Ghar',
  'Kukatpally',
  'Miyapur',
  'Secunderabad',
  'LB Nagar',
  'Kurnool',
  'Anantapur',
  'Tirupati'
];


  leavingFrom: string = '';
  goingTo: string = '';
  date: string = '';
  passengers: number = 1;

  searchResults: any[] = []; // To store results from backend

  constructor(private http: HttpClient, private router: Router) {}

  searchRides() {
    // Build the payload to send to backend
    const payload = {
      leavingFrom: this.leavingFrom,
      goingTo: this.goingTo,
      date: this.date,
      passengers: this.passengers
    };
    console.log(payload)

    this.http.post<any[]>('http://localhost:8095/login/search', payload)
      .subscribe(
        (results) => {
          this.searchResults = results;
          console.log('Search Results:', results);
        },
        (error) => {
          console.error('Error fetching search results:', error);
        }
      );
  }

   viewRideDetails(rideId: number) {
  // Pass the ride ID in the route
  this.router.navigate(['/ride', rideId]);
}


showProfile = false;
userName = 'Harish'; // Can come from login later

goToProfile() {
  this.router.navigate(['/profile']);
}

goToMyRides() {
  this.router.navigate(['/my-rides']);
}

logout() {
  localStorage.clear();
  this.router.navigate(['/login']);
}

}
