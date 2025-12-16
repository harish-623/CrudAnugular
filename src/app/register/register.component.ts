import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisteService } from '../registe.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

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
    loading: boolean = false; 

    // private baseUrl =
    // window.location.hostname === 'localhost'
    // ? `https://api.vyropool.info/login`
    // : `https://api.vyropool.info/login`;
  
    private baseUrl=`${environment.apiUrl}`;
    constructor(private fb: FormBuilder, private http: HttpClient,private userService:RegisteService,private router: Router) {
        this.userForm = this.fb.group({
        username: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        phonenumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        age: ['', [Validators.required, Validators.min(18)]],
        fullname: ['', [Validators.required]],
        role: ['USER', [Validators.required]],
        otp: ['']   // <-- FIX
        
        
        });
    }

ngOnInit() {
    this.userForm.statusChanges.subscribe(() => {
      console.log(this.userForm);
      console.log("✔ Form Valid:", this.userForm.valid);
      console.log("✖ Form Invalid:", this.userForm.invalid);

      console.log("Field Validation Errors:");
      Object.keys(this.userForm.controls).forEach(key => {
        console.log(key, this.userForm.get(key)?.errors);
      });

      console.log("OTP Verified:", this.otpVerified);
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
      this.loading=true
      this.http.post(`${this.baseUrl}/send?email=${email}`, {}, { responseType: 'text' })
      .subscribe({
      next: (response: string) => {
        this.loading = false;
        this.otpSent = true;
        this.showMessage(response, 'alert-success');
        // this.showMessage(`✅ OTP sent successfully to ${email}`, 'alert-success');
      },
      error: (error) => {
        console.error('Error sending OTP:', error);
        this.loading = false;
        this.showMessage('❌ Failed to send OTP.', 'alert-danger');
      }
      });
}


showPassword = false;

togglePassword() {
  this.showPassword = !this.showPassword;
}

goHome() {
  this.router.navigate(['/login']);
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
    this.loading=true
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
        this.loading = false;
      },
      error: (error) => {
        console.error('Error verifying OTP:', error);
        this.showMessage('❌ OTP verification failed. Please try again.', 'alert-danger');
        this.loading = false;
      }
    });
  }

onSubmit() {
      console.log(this.userForm)
      

  // Mark all fields as touched → shows validation errors in UI
  
      this.loading=true
        if (this.userForm.valid) {
          this.userService.createUser(this.userForm.value).subscribe(
            (response: any) => {
                        this.responseMessage = response;
                        this.responseClass = 'alert-success';
                        this.loading = false;
                        setTimeout(() => {
                          this.router.navigate(['/login']);
                      }, 2000);
                    },

                    
                    (error) => {
                      if (error.error) {
                        this.loading = false;
                        this.responseMessage = "User Registration Failed" +error.error; // Backend error message: "User registration failed"
                    } else {
                        this.responseMessage = 'An unexpected error occurred. Please try again.';
                        this.loading = false;
                    }

                    this.responseClass = 'alert-danger';
                    this.loading = false;
                  }
                );
        }
    }

}
