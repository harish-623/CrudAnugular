import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageLoaderService } from '../image-loader.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth.service';

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

  loadLogo() {
    const logoUrl = 'https://avatars.githubusercontent.com/u/124091983';
    this.imageLoader.loadImage(logoUrl).subscribe((blob: Blob) => {
      this.logoUrl = URL.createObjectURL(blob);
    });
  }

  onSubmitLogin(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
  
    
      console.log(username)
      console.log(password)
  
      this.authService.login(username, password).subscribe(
        (response: { success: boolean; username: string; token: string ;id:string ; email:string}) => {
          if (response.success) {
            // alert('Login Successful');
            localStorage.setItem('username', response.username);
            localStorage.setItem('driverId',response.id)
            localStorage.setItem('email',response.email)
            
            console.log(username)
            this.router.navigate(['/home']);
            // this.showSuccessMessage();
          } else {
            this.loginError = 'Login failed. Please check your credentials.';
            console.log(this.loginError);
          }
        },
        (error: any) => {
          console.error('Error occurred during login:', error);
          this.loginError = "Login failed. Please check your credentials."; // Display error message to the user
          alert('Invalid username or password.');
        }
      );
    } else {
      console.log('Form is invalid');
      this.loginError = 'Please fill out the form correctly.';
    }
  }
  

  showSuccessMessage() {
    this.loginError = 'Login successful!';
  }


  
  onSubmitRegister(): void {
    if (this.registerForm.valid) {
      const registerData = this.registerForm.value;
      this.http.post<any>('https://spring-boot-crud-3qhx.onrender.com/login/register', registerData).pipe(
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

  navigateToRegister() {
    this.router.navigate(['/register']);
}

}
