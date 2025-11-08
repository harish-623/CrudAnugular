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

    constructor(private fb: FormBuilder, private http: HttpClient,private userService:RegisteService,private router: Router) {
        this.userForm = this.fb.group({
        username: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        phonenumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        age: ['', [Validators.required, Validators.min(18)]],
        fullname: ['', [Validators.required]],
        role: ['USER', [Validators.required]]
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
