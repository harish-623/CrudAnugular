import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

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

  // ✅ Pending booking requests
  pendingRequests: any[] = [];
  noResultsMessage = '';

  constructor(private http: HttpClient) {}

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
        if (response.result === 'Success' ) {
          this.pendingRequests = response.rides; 
          this.noResultsMessage = '';
        }
        // } else {
        //   this.pendingRequests = [];
        //   this.noResultsMessage = response.message || 'No pending requests';
        // }

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
  rejectRequest(bookingId: number) {
    this.loading = true;

    this.http.post(
      `${environment.apiUrl}/driver/bookings/reject/${bookingId}`,
      {}
    ).subscribe({
      next: () => {
        this.loading = false;
        this.showPopup('Booking rejected successfully', 'success');
        this.removeRequestFromList(bookingId);
      },
      error: (err) => {
        console.error('Reject failed', err);
        this.loading = false;
        this.showPopup('Failed to reject booking', 'error');
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

  approveRequest(bookingId:number)
  {

  }
}
