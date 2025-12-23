import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-driver-registration',
  templateUrl: './driver-registration.component.html'
})
export class DriverRegistrationComponent {

  @Output() success = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  loading = false;
  message = '';

  driverForm = this.fb.group({
    dlNumber: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) { }

  submit(): void {
    if (this.driverForm.invalid) {
      return;
    }

    const userId = Number(localStorage.getItem('driverId'));

    if (!userId) {
      this.message = 'Invalid user session. Please login again.';
      return;
    }

    this.loading = true;

    const payload = {
      userId,
      dlNumber: this.driverForm.value.dlNumber as string
    };

    this.registerDriver(payload).subscribe({
      next: () => {
        this.message = 'Driver registered successfully. Awaiting verification.';
        this.loading = false;
        this.success.emit();
      },
      error: () => {
        this.message = 'Registration failed. Try again.';
        this.loading = false;
      }
    });
  }

  close(): void {
    this.closed.emit();
  }

  private registerDriver(payload: { userId: number; dlNumber: string }) {
    return this.http.post(
      `${environment.apiUrl}/driverprofile/register`,
      payload
    );
  }
}
