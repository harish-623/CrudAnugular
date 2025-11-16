import { Component ,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {


  user: any = {};
  noResultsMessage: string = '';
  selectedFile: File | null = null;
  userImageUrl: string = '';
  isEditable: boolean= false;
  loading: boolean = true;

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
        this.loading = false;
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

    const apiUrl =
  window.location.hostname === 'localhost'
    ? `http://localhost:8095/login/update/${userId}`
    : `https://spring-boot-crud-3qhx.onrender.com/login/update/${userId}`;
    this.http.put(apiUrl, payload)
      .subscribe({
        next: (res) => {
          this.loading = false;
          alert("Profile updated successfully!");
          this.isEditable = false;
          const username="";
          this.fetchUserProfile(username);
        },
        error: (err) => {
          console.error("Update failed:", err);
          alert("Failed to update profile.");
          this.loading = false;
        }
      });

  

}


  

  fetchUserProfile(username: string): void {
      // const apiUrl = `http://localhost:8095/login/profileRetrive?username=${username}`;
      const apiUrl =
  window.location.hostname === 'localhost'
    ? `http://localhost:8095/login/profileRetrive?username=${username}`
    : `https://spring-boot-crud-3qhx.onrender.com/login/profileRetrive?username=${username}`;

    this.http.get<any[]>(apiUrl).subscribe(
      (response) => {
        console.log('API Response:', response);

        if (response && response.length > 0) {
          const data = response[0];
          this.noResultsMessage = '';
          console.log('User profile:', this.user);
          this.user = {
            name: data.username,
            age: data.age,
            phone:data.phonenumber,
            fullname:data.fullname,
            email:data.email,
            emergencyContact:data.emergencyContact,

            // fullname=data.fullname,
            imageUrl: 'assets/default-user.jpg',
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
