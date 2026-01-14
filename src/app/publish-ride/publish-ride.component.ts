import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

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
  instantBooking :boolean=false;

  loading: boolean = false; // ✅ loader flag
  fromSuggestions: any[] = [];
  toSuggestions: any[] = [];
  successMessage: string | null = null;
  errorMessage: string | null = null;

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

  constructor(private http: HttpClient, private router: Router) { }

  today!: string;






  ngOnInit() {
    const now = new Date();
    this.today = now.toISOString().split('T')[0];
    console.log('Today:', this.today); // 👈 MUST log
  }
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
      phoneNumber: this.contactNumber,
      instantBooking: this.instantBooking   // map to backend key
    };


    console.log(payload)
    const driverId = localStorage.getItem('driverId');

    console.log(driverId)

    const url = `${environment.apiUrl}/publish/${driverId}`;


    this.loading = true;
    this.http.post(url, payload)
      .subscribe({
        next: (res: any) => {
          this.loading = false;
          this.successMessage =
            'Ride published successfully. Passengers can now request to join.';
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

    // // const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
    // const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}
    // &addressdetails=1&limit=5&countrycodes=in&accept-language=en`;



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

  checkDriverEligibility(userId: number) {
    return this.http.get<any>(
      `${environment.apiUrl}/driver/eligibility/${userId}`
    );
  }


}
