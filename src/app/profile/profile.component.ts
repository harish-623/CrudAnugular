import { Component ,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

<<<<<<< Updated upstream
//   user = {
//   name: 'Harish Nallabothula',
//   age: 24,
//   phone: '+91 9876543210',
//   imageUrl: '',
//   description: 'Passionate about exploring new places and connecting with like-minded travelers.',
//   ridesBooked: 12,
//   ridesTraveled: 9
// };

  user: any = {};
  noResultsMessage: string = '';
=======

  user: any = {};
  noResultsMessage: string = '';
  selectedFile: File | null = null;
  userImageUrl: string = '';
  isEditable: boolean= false;
>>>>>>> Stashed changes

  constructor(
    private route: ActivatedRoute,
     private http: HttpClient
    // private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const username = params['username'];
      if (username) {
        console.log('Username received:', username);
        this.fetchUserProfile(username);
      } else {
        this.noResultsMessage = 'No username provided.';
      }
    });
  }

<<<<<<< Updated upstream
  fetchUserProfile(username: string): void {
      const apiUrl = `https://spring-boot-crud-3qhx.onrender.com/login/profileRetrive?username=${username}`;
=======
  

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadImage() {
    if (!this.selectedFile) {
      alert('Please select an image!');
      return;
    }

  const formData = new FormData();
  formData.append('image', this.selectedFile);

  const userId = localStorage.getItem('driverId');

  this.http.post(`http://localhost:8095/login/user/${userId}/upload-image`, formData)
    .subscribe({
      next: (res) => {
        alert('Image uploaded successfully!');
        this.loadUserImage(); // reload image after upload
      },
      error: (err) => console.error(err)
    });
}

  loadUserImage() {
  const userId = localStorage.getItem('driverId');
  this.userImageUrl = `http://localhost:8095/login/user/${userId}/image`;
}



enableEdit()
{
  this.isEditable = true;
}

updateUser()
{
  const userId = localStorage.getItem('driverId');
  const payload = {
      fullname: this.user.fullname,
      phonenumber: this.user.phonenumber,
      age: this.user.age,
      emergencyContact: this.user.emergencyContact,
      profileImage: this.user.profileImage
    };
    this.http.put(`http://localhost:8095/login/update/${userId}`, payload)
      .subscribe({
        next: (res) => {
          alert("Profile updated successfully!");
          this.isEditable = false;
          const username="";
          this.fetchUserProfile(username);
        },
        error: (err) => {
          console.error("Update failed:", err);
          alert("Failed to update profile.");
        }
      });

  

}


  

  fetchUserProfile(username: string): void {
      const apiUrl = `http://localhost:8095/login/profileRetrive?username=${username}`;
>>>>>>> Stashed changes

    this.http.get<any[]>(apiUrl).subscribe(
      (response) => {
        console.log('API Response:', response);

        if (response && response.length > 0) {
          const data = response[0];
          this.noResultsMessage = '';
          console.log('User profile:', this.user);
          this.user = {
<<<<<<< Updated upstream
            name: data.fullname || data.username,
            age: data.age,
            phone:data.phonenumber,

            // fullname=data.fullname,
            imageUrl: 'assets/default-user.png',
=======
            name: data.username,
            age: data.age,
            phone:data.phonenumber,
            fullname:data.fullname,
            email:data.email,
            emergencyContact:data.emergencyContact,

            // fullname=data.fullname,
            imageUrl: 'assets/default-user.jpg',
>>>>>>> Stashed changes
            description: 'Passionate traveler and ride enthusiast!',
            ridesBooked: 12,
            ridesTraveled: 9
          };
          
        } else {
          this.user = null;
          this.noResultsMessage = 'No profile found for this user.';
        }
      },
      (error) => {
        console.error('Error fetching user profile:', error);
        this.noResultsMessage = 'Error fetching user profile.';
      }
    );
  }

}
