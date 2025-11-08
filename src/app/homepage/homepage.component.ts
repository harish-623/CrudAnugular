import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {

  
  username   = localStorage.getItem('username') || '';
  driverId=localStorage.getItem('driverId') || '';
  


  leavingFrom: string = '';
  goingTo: string = '';
  date: string = '';
  passengers: number = 1;
  noResultsMessage: string = '';

  searchResults: any[] = []; // To store results from backend
  fromSuggestions: any[] = [];
  toSuggestions: any[] = [];

  recentFromSearches: string[] = [];
  recentToSearches: string[] = [];

  searchSubject = new Subject<{ query: string; type: 'from' | 'to' }>();

  constructor(private http: HttpClient, private router: Router) {
    
  }

  goToPublishRide() {
  this.router.navigate(['/publish-ride']); // Replace with your route path
}

  searchRides() {
    // Build the payload to send to backend
    const payload = {
      leavingFrom: this.leavingFrom,
      goingTo: this.goingTo,
      date: this.date,
      passengers: this.passengers
    };
    console.log(payload)

    this.http.post<any[]>(' http://localhost:8095/login/search', payload)
      .subscribe(
        (results) => {
          if (results && results.length > 0) {
        this.searchResults = results;
        console.log('Search Results:', results);
      } else {
        this.searchResults = [];
        console.log('No rides found');
        this.noResultsMessage = 'No rides found';
        // alert('No rides found'); // or show this message in UI instead of alert
      }
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
userName = localStorage.getItem('username') || '';

 // Can come from login later

goToProfile() {
  // this.router.navigate(['/profile']) ;
  this.router.navigate(['/profile'], { queryParams: { username: this.userName } });
}

goToMyRides() {
  
  this.router.navigate(['/my-rides'], { queryParams: { driverId: this.driverId } });
}

logout() {
  localStorage.clear();
  this.router.navigate(['/login']);
}


  
 







  searchPlaces(query: string, type: 'from' | 'to') {
    if (query.length < 2) return;
    
    // const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}
    &addressdetails=1&limit=5&countrycodes=in&accept-language=en`;


    // this.http.get<any[]>(url).subscribe((data) => {
    //   if (type === 'from') this.fromSuggestions = data;
    //   else this.toSuggestions = data;
    // });
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
