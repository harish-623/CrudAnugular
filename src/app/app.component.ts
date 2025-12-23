import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'login-app';

  constructor(private router: Router,
    private authService: AuthService
  ) {}
  showProfile = false;
  isLoggedIn = false;
  userName = localStorage.getItem('username') || '';
  driverId=localStorage.getItem('driverId') || '';
 

ngOnInit() {
  this.authService.isLoggedIn$.subscribe(status => {
    this.isLoggedIn = status;
  });
}

  goToProfile() {
  this.router.navigate(['/profile']);
}

goToMyRides() {
  this.router.navigate(['/my-rides']);
}

logout() {
  localStorage.clear();
  this.isLoggedIn = false;
  this.router.navigate(['/login']);
  
  
}

}
