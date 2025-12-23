import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageLoaderService } from '../image-loader.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  logoUrl: string = '';
  loginError: any;
  registerError: any;
  loading: boolean = true;
  responseClass: string = '';
  profile: boolean | null = null;
  

  constructor(
    private formBuilder: FormBuilder,
    private imageLoader: ImageLoaderService,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.loadLogo();
  }

  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  loadLogo() {
    const logoUrl = 'https://avatars.githubusercontent.com/u/124091983';
    this.imageLoader.loadImage(logoUrl).subscribe((blob: Blob) => {
      this.logoUrl = URL.createObjectURL(blob);
      this.loading = false
    });
  }

  onSubmitLogin(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.loading = true;
      console.log(username)
      console.log(password)

      this.authService.login(username, password).subscribe(
        (response: { success: boolean; username: string; token: string; id: string; email: string; eemergencyEmail: string }) => {
          if (response.success) {
            console.log(response)

            // alert('Login Successful');
            localStorage.setItem('username', response.username);
            localStorage.setItem('driverId', response.id)
            localStorage.setItem('token', response.token);
            localStorage.setItem('emergencyEmail', response.eemergencyEmail)
            console.log(localStorage.getItem('emergencyEmail'));
            this.authService.setLoggedIn(true);


            console.log(username)
            this.router.navigate(['/home']);
            // this.showSuccessMessage();
          } else {
            this.loginError = 'Login failed. Please check your credentials.';
            console.log(this.loginError);
            this.showMessage(this.loginError, 'alert-danger');
          }
          this.loading = false;
        },
        (error: any) => {
          this.loading = false;
          if (error.status === 401) {
            this.loginError = '❌ Invalid username or password';
            this.loginError = "Login failed. Please check your credentials."; // Display error message to the user
            console.log(this.loginError);
            this.showMessage(this.loginError, 'alert-danger');
          } else if (error.error) {
            this.loginError = error.error;
            this.showMessage(this.loginError, 'alert-danger');
          }
          console.error('Error occurred during login:', error);

        }

      );
    } else {
      console.log('Form is invalid');
      this.loginError = 'Please fill out the form correctly.';
    }
  }


  

  private showMessage(message: string, cssClass: string): void {
    this.loginError = message;
    this.responseClass = cssClass;

    setTimeout(() => {
      this.loginError = '';
    }, 40000);
  }


  onSubmitRegister(): void {
    if (this.registerForm.valid) {
      const registerData = this.registerForm.value;
      this.http.post<any>(`${environment.apiUrl}/register`, registerData).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.error instanceof ErrorEvent) {
            console.error('An error occurred:', error.error.message);
          } else {
            console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
            this.registerError = error.error;
          }
          return throwError('Something went wrong during registration; please try again later.');
        })
      )
        .subscribe(response => {
          if (response.success) {
            alert("Registration Successful");
            this.router.navigate(['/login']);
          } else {
            console.log('Registration failed');
          }
        }, error => {
          console.error('Error occurred during registration:', error);
          alert("Registration failed, please check your input.");
        });
    } else {
      console.log('Registration form is invalid');
    }
  }
  navigateToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  message = '';
 

  

  

  verifyPhone(): void {
    
  }

  verifyEmail(): void {
    
    
  }

  loginWith(provider: 'google' | 'instagram'): void {
    
  }

}
