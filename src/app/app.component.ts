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
  id =  '';
  driverId= '';
 

ngOnInit() {
  this.authService.isLoggedIn$.subscribe(status => {
    this.isLoggedIn = status;
  });
  this.id = localStorage.getItem('id') || '';
  this.driverId=localStorage.getItem('driverId') || '';
}

  goToProfile() {
  const driverId = localStorage.getItem('driverId');

  if (!driverId) {
    alert('Session expired. Please login again.');
    this.router.navigate(['/login']);
    return;
  }

  this.router.navigate(['/profile'], {
    queryParams: { driverId }
  });
}


goToMyRides() {
  
  const driverId = localStorage.getItem('driverId');

  if (!driverId) {
    alert('Session expired. Please login again.');
    this.router.navigate(['/login']);
    return;
  }

  this.router.navigate(['/my-rides'], {
    queryParams: { driverId }
  });
}

  


logout() {
  localStorage.clear();
  this.isLoggedIn = false;
  this.router.navigate(['/login']);
  
  
}

}
