import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  user = {
  name: 'Harish Nallabothula',
  age: 24,
  phone: '+91 9876543210',
  imageUrl: '',
  description: 'Passionate about exploring new places and connecting with like-minded travelers.',
  ridesBooked: 12,
  ridesTraveled: 9
};


}
