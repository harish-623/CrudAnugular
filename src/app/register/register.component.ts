import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisteService } from '../registe.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  userForm: FormGroup;
    responseMessage: string | null = null;
    responseClass: string = '';
    otpSent: boolean = false;
    otpVerified: boolean = false;
    private baseUrl = 'http://localhost:8095/login';
  
    constructor(private fb: FormBuilder, private http: HttpClient,private userService:RegisteService,private router: Router) {
        this.userForm = this.fb.group({
        username: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        phonenumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        age: ['', [Validators.required, Validators.min(18)]],
        fullname: ['', [Validators.required]],
        role: ['USER', [Validators.required]],
        otp: ['']
        
        });
    }

    private showMessage(message: string, cssClass: string): void {
  this.responseMessage = message;   // sets the text (e.g. “OTP sent successfully”)
  this.responseClass = cssClass;    // sets the alert color (Bootstrap class)
  setTimeout(() => (this.responseMessage = ''), 5000); // clears message after 5 sec
}

    sendOtp(): void {
    const email = this.userForm.get('email')?.value;

    if (!email) {
      this.showMessage('❌ Please enter a valid email address', 'alert-danger');
      return;
    }

    // this.http.post(`${this.baseUrl}/send`, null, { params: { email } }).subscribe({
    //   next: (response: any) => {
    //     this.otpSent = true;
    //     this.showMessage(`✅ OTP sent successfully to ${email}`, 'alert-success');
    //     console.log('OTP sent:', response);
    //   },
    //   error: (error) => {
    //     console.error('Error sending OTP:', error);
    //     this.showMessage('❌ Failed to send OTP. Please try again.', 'alert-danger');
    //   }
    // });
    this.http.post(`${this.baseUrl}/send?email=${email}`, {}, { responseType: 'text' })
    .subscribe({
      next: (response: string) => {
        this.otpSent = true;
        this.showMessage(response, 'alert-success');
        // this.showMessage(`✅ OTP sent successfully to ${email}`, 'alert-success');
      },
      error: (error) => {
        console.error('Error sending OTP:', error);
        this.showMessage('❌ Failed to send OTP.', 'alert-danger');
      }
    });
  }

  verifyOtp(): void {
  const email = this.userForm.get('email')?.value;
    const otp = this.userForm.get('otp')?.value;
    console.log(otp)
    console.log(email)

    if (!otp) {
      this.showMessage('❌ Please enter the OTP.', 'alert-danger');
      return;
    }

    this.http.post(`${this.baseUrl}/verify`, null, { 
      params: { email, otp },
      responseType: 'text'   // 👈 This line fixes the issue
    })
    .subscribe({
      next: (response: string) => {
        console.log('Verify response:', response);

        if (response.includes('✅ OTP verified successfully')) {
          this.otpVerified = true;
          this.showMessage(response, 'alert-success');
        } else {
          this.showMessage(response, 'alert-danger');
        }
      },
      error: (error) => {
        console.error('Error verifying OTP:', error);
        this.showMessage('❌ OTP verification failed. Please try again.', 'alert-danger');
      }
    });
  }

  

    onSubmit() {
      console.log(this.userForm)
        if (this.userForm.valid) {
          this.userService.createUser(this.userForm.value).subscribe(
            (response: any) => {
                        this.responseMessage = response;
                        this.responseClass = 'alert-success';
                        setTimeout(() => {
                          this.router.navigate(['/login']);
                      }, 2000);
                    },

                    
                    (error) => {
                      if (error.error) {
                        this.responseMessage = "User Registration Failed" +error.error; // Backend error message: "User registration failed"
                    } else {
                        this.responseMessage = 'An unexpected error occurred. Please try again.';
                    }
                    this.responseClass = 'alert-danger';
                  }
                );
        }
    }

}
