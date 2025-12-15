import { Component,OnInit  } from '@angular/core';
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
  imageUrl:string = '';
  isLoggedIn = false;
  today!: string;
  placesList: string[] = [
  'Gachibowli,Hyderabad',
  'Secunderabad,Hyderabad',
  'KukataPally,Hyderabad',
  'HitechCity,Hyderabad',
  'Shamshabad,Hyderabad',
  'Aramghar,Hyderabad',
  'Bellary Chowrastha,Kurnool',
  'Kurnool Bus stand, Kurnool',
  'MGBS,Hyderabad',
  'C-Camp ,Kurnool',
  'Manikonda, Hyderabad'
];

  searchSubject = new Subject<{ query: string; type: 'from' | 'to' }>();

  constructor(private http: HttpClient, private router: Router) {
    
  }
  



  ngOnInit() {
    const now = new Date();
  this.today = now.toISOString().split('T')[0];
   this.isLoggedIn = !!localStorage.getItem('username');
  this.loadUserImage();   // Load image automatically
}

  loadUserImage() {
     const userId=localStorage.getItem("driverId")
          
  const imgApi =
    window.location.hostname === 'localhost'
      ? `https://api.vyropool.info/login/user/${userId}/profile-image-base64`
      : `https://api.vyropool.info/login/user/${userId}/profile-image-base64`;

  this.http.get(imgApi, { responseType: 'text' }).subscribe({
    next: (dataUri) => {
      if (dataUri && dataUri.startsWith("data")) {
        this.imageUrl = dataUri; 
       
      } else {
        this.imageUrl = 'assets/default-user.jpg'; // fallback
      }
    },
    error: (err) => {
      console.error("Image fetch error:", err);
      this.imageUrl = 'assets/default-user.jpg';
    }
  });
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
    ? 'https://api.vyropool.info/login/search'
    : 'https://api.vyropool.info/login/search';

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
  this.isLoggedIn = false;
  this.router.navigate(['/login']);
  
  
}

goToLogin()
{
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
    ? `https://api.vyropool.info/login/alert`
    : `https://api.vyropool.info/login/alert`;
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
    
    // nt(query)}`;
    // const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}
    // &addressdetails=1&limit=5&countrycodes=in&accept-language=en`;


    // this.http.get<any[]>(url).subscribe((data) => {
    //   if (type === 'from') this.fromSuggestions = data;
    //   else this.toSuggestions = data;
    // });
    // this.http.get<any[]>(url).subscribe((data) => {
    // const formattedData = data.map(place => {
    //   const { city, town, village, state } = place.address;
    //   const formattedName = `${city || town || village || place.display_name}, ${state ?? ''}`;
    //   return { ...place, formattedName };
    // });
    const formattedData = this.placesList.filter(place =>
    place.toLowerCase().includes(query.toLowerCase())
  );

    if (type === 'from') this.fromSuggestions = formattedData;
    else this.toSuggestions = formattedData;
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
