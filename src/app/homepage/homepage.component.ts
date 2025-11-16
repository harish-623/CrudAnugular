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
  email=localStorage.getItem('emergencyEmail');
  


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
  loading: boolean = true;

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

    const apiUrl =
  window.location.hostname === 'localhost'
    ? 'http://localhost:8095/login/search'
    : 'https://spring-boot-crud-3qhx.onrender.com/login/search';

    this.http.post<any[]>(apiUrl, payload)
      .subscribe(
        (results) => {
          
          console.log('Raw API response:', results); 
      
      if (Array.isArray(results) && results.length > 0) {
        this.searchResults = results;
        this.noResultsMessage = '';
        console.log('✅ Search Results:', results);
      } else {
        this.searchResults = [];
        this.noResultsMessage = 'No rides found';
        console.log('⚠️ No rides found');
      }
      this.loading = false;
        },
        (error) => {
          console.error('Error fetching search results:', error);
          this.loading = false;
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

goToMyPublishRides()
{
  this.router.navigate(['/my-publish-rides'], { queryParams: { driverId: this.driverId } })
}

logout() {
  localStorage.clear();
  this.router.navigate(['/login']);
}


triggerSOS()
{
  
  console.log(this.email);
  const username=localStorage.getItem('username')
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const payload = {
          email: this.email,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          username:username
        };
        console.log(payload)
        const apiUrl =
  window.location.hostname === 'localhost'
    ? `http://localhost:8095/login/alert`
    : `https://spring-boot-crud-3qhx.onrender.com/login/alert`;
        this.http.post(apiUrl, payload, { responseType: 'text' })
  .subscribe({
    next: (res) => {
      console.log("Backend:", res);
      alert(res); // shows exactly what backend sends
      this.loading = false;
    },
    error: (err) => {
      console.error(err);
      this.loading = false;
      alert('❌ Failed to send SOS alert. Please try again.');
    }
  });

      },
      (error) => {
        alert('⚠️ Unable to get your location. Please enable GPS.');
        this.loading = false;
      }
    );
  } else {
    alert('Geolocation not supported by your browser.');
  }

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
