import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { Router } from '@angular/router';

@Component({
  selector: 'app-approve-request',
  templateUrl: './approve-request.component.html',
  styleUrls: ['./approve-request.component.css']
})
export class ApproveRequestComponent implements OnInit {

  loading = false;

  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  driverId!: number;

   ride: any
  // ✅ Pending booking requests
  pendingRequests: any[] = [];
  noResultsMessage = '';

  constructor(private http: HttpClient,private router: Router) { }

  ngOnInit(): void {
    this.driverId = Number(localStorage.getItem('driverId'));

    if (!this.driverId) {
      this.noResultsMessage = 'Driver not logged in';
      return;
    }

    this.fetchPendingRequests();
  }

  // 🔹 Fetch pending requests for driver
  fetchPendingRequests() {
    this.loading = true;

    const apiUrl = `${environment.apiUrl}/${this.driverId}/pending-bookings`;

    this.http.get<any>(apiUrl).subscribe({
      next: (response) => {
        console.log('Pending booking response:', response);
        this.pendingRequests = response.rides;
        console.log('pendingRequests:', this.pendingRequests);
        if (response.success === true) {
          
          this.pendingRequests = response.rides;
          this.noResultsMessage = '';

        } else {
          this.pendingRequests = [];
          this.noResultsMessage = response.message || 'No pending requests';
        }

        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching pending bookings:', error);
        this.noResultsMessage = 'Failed to load booking requests';
        this.loading = false;
      }
    });
  }

  // 🔹 Reject booking
  rejectRequest(request: any) {
   
const bookingId=request.bookingId;
    const url = `${environment.apiUrl}/reject-ride/${bookingId}`;
    this.loading = true;
    const passengerId = Number(localStorage.getItem('driverId')); // logged in user id
    const rideDriverId = request.id 
    const seatsBooked = request.seatsBooked
    console.log(seatsBooked) // driver who published ride

    if (passengerId === rideDriverId) {
      alert("🚫 Driver can't book their own ride!");

      return; // stop booking
    }
    const rideId = request.id; // or this.ride.id depending on your object
    console.log(rideId)
    
    const params = new HttpParams()
    .set('rideId', rideId)
    .set('passengerId', passengerId)
    .set('seatsBooked', seatsBooked);
   
    this.http.post(url, null, { params }).subscribe({
      next: (res: any) => {
        console.log(res)
        if (res.result === 'Success') {
          console.log('🎉', res.message);
          this.loading = false;
          
          // this.showPopup('Ride booked successfully!', 'success');
          alert("Ride Rejected Successfully")

          // this.router.navigate(['/home']);
          this.fetchPendingRequests()
        } else {
          console.log(res.result)
          alert(res.message)
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error booking ride:', err);
        alert('Failed to book the ride. Please try again.');
        this.loading = false;
      }
    });
  }

  // 🔹 Remove rejected request from UI
  removeRequestFromList(bookingId: number) {
    this.pendingRequests = this.pendingRequests.filter(
      req => req.bookingId !== bookingId
    );

    if (this.pendingRequests.length === 0) {
      this.noResultsMessage = 'No pending requests';
    }
  }

  // 🔹 Toast popup
  showPopup(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 2500);
  }

  closePopup() {
    this.showToast = false;
  }

  approveRequest(request: any) {
    

    const passengerId = Number(localStorage.getItem('driverId')); // logged in user id
    const rideDriverId = request.id  // driver who published ride

    if (passengerId === rideDriverId) {
      alert("🚫 Driver can't book their own ride!");

      return; // stop booking
    }
    const rideId = request.id; // or this.ride.id depending on your object
    console.log(rideId)

    const seatsBooked = request.seatsBooked
    console.log(seatsBooked)

    const bookingId=request.bookingId;


    const url = `${environment.apiUrl}/approve-ride/${bookingId}`;

  const params = new HttpParams()
    .set('rideId', rideId)
    .set('passengerId', passengerId)
    .set('seatsBooked', seatsBooked);

    this.loading = true;
   
    this.http.post(url, null, { params }).subscribe({
      next: (res: any) => {
        console.log(res)
        if (res.result === 'Success') {
          console.log('🎉', res.message);
          this.loading = false;
          
          // this.showPopup('Ride booked successfully!', 'success');
          alert("Ride booked Successfully")

          this.router.navigate(['/home']);
        } else {
          console.log(res.result)
          alert(res.message)
          // this.errorMessage = res.message || 'Booking failed. Please try again.';

        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error booking ride:', err);
        alert('Failed to book the ride. Please try again.');
        this.loading = false;
      }
    });
  


  }



}
