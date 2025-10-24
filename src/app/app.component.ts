import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'login-app';

  constructor(private router: Router) {}
  showProfile = false;
userName = 'UdayKumar';

  goToProfile() {
  this.router.navigate(['/profile']);
}

goToMyRides() {
  this.router.navigate(['/my-rides']);
}

logout() {
  localStorage.clear();
  this.router.navigate(['/login']);
}

}
