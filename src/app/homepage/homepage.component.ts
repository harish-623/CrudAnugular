import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ChatMessage, ChatService } from '../chat.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {
  @ViewChild('floatingChatWindow') floatingChatWindow?: ElementRef<HTMLDivElement>;






  leavingFrom: string = '';
  goingTo: string = '';
  date: string = '';
  passengers: number = 1;
  noResultsMessage: string = '';
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  username = ''
  driverId = ''
  email = ''

  searchResults: any[] = []; // To store results from backend
  fromSuggestions: any[] = [];
  toSuggestions: any[] = [];

  recentFromSearches: string[] = [];
  recentToSearches: string[] = [];
  loading: boolean = true;
  imageUrl: string = '';
  isLoggedIn = false;
  today!: string;
  placesList: string[] = [
    'Gachibowli,Hyderabad',
    'Secunderabad,Hyderabad',
    'KukataPally,Hyderabad',
    'HitechCity,Hyderabad',
    'Shamshabad,Hyderabad',
    'Aramghar,Hyderabad',
    'Bellary Chowrastha,Kurnool',
    'Kurnool Bus stand, Kurnool',
    'MGBS,Hyderabad',
    'C-Camp ,Kurnool',
    'Manikonda, Hyderabad',
    'Marathalli, Bangalore',
    'Whitefield, Bangalore',
    'Electronic City, Bangalore',
    'Indiranagar, Bangalore',
    'Koramangala, Bangalore',
    'MG Road, Bangalore',
    'Hebbal, Bangalore',
    'Rajajinagar, Bangalore',
    'Yellahanka, Bangalore',
    'Anathapuram,Andhrapradesh',
    'Rayachoti,Andhrapradesh',
    'Kadapa,Andhrapradesh'

  ];

  searchSubject = new Subject<{ query: string; type: 'from' | 'to' }>();

  // Chat widget state
  chatOpen: boolean = false;
  chatPrompt: string = '';
  chatLoading: boolean = false;
  defaultChatMessages: ChatMessage[] = [
    { role: 'assistant', text: 'Hi, I\'m Vyro Assist - ask me about rides, safety, or your bookings.' }
  ];
  chatMessages: ChatMessage[] = [...this.defaultChatMessages];

  constructor(private http: HttpClient, private router: Router, private chatService: ChatService) {
  }

  toggleChat() {
    this.chatOpen = !this.chatOpen;
    if (this.chatOpen) {
      this.scrollFloatingChatToLatestMessage();
    }
  }

  openChat() {
    this.chatOpen = true;
    this.scrollFloatingChatToLatestMessage();
  }

  closeChat() {
    this.chatOpen = false;
  }

  sendChat() {
    const trimmed = this.chatPrompt.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = { role: 'user', text: trimmed };
    this.chatMessages.push(userMessage);
    this.chatService.addLocalMessage(userMessage);
    this.scrollFloatingChatToLatestMessage();

    this.chatPrompt = '';
    this.chatLoading = true;

    this.chatService.sendPrompt(trimmed).subscribe({
      next: (res) => {
        const text = res?.ai_response || 'No response from assistant.';
        const assistantMessage: ChatMessage = { role: 'assistant', text };
        this.chatMessages.push(assistantMessage);
        this.chatService.addLocalMessage(assistantMessage);
        this.scrollFloatingChatToLatestMessage();
        this.chatLoading = false;
      },
      error: (err) => {
        console.error('Chat API error:', err);
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          text: err?.status === 500
            ? 'The AI ride assistant had a server error. Please check the Python chat service and try again.'
            : 'Unable to reach the chat service. Please try again later.'
        };
        this.chatMessages.push(assistantMessage);
        this.chatService.addLocalMessage(assistantMessage);
        this.scrollFloatingChatToLatestMessage();
        this.chatLoading = false;
      }
    });
  }

  loadChatHistory() {
    const savedMessages = this.chatService.loadLocalHistory();
    this.chatMessages = savedMessages.length ? savedMessages : [...this.defaultChatMessages];
    this.scrollFloatingChatToLatestMessage();
  }

  clearChatHistory() {
    this.chatService.clearLocalHistory();
    this.chatMessages = [...this.defaultChatMessages];
    this.scrollFloatingChatToLatestMessage();
  }

  formatMessageText(text: string): string {
    return this.chatService.formatMessageText(text);
  }

  private scrollFloatingChatToLatestMessage(): void {
    setTimeout(() => {
      const chatWindow = this.floatingChatWindow?.nativeElement;

      if (chatWindow) {
        chatWindow.scrollTop = chatWindow.scrollHeight;
      }
    });
  }

  openSupportChat() {
    this.router.navigate(['/support-chat']);
    this.closeChat();
  }




  ngOnInit() {
    const now = new Date();
    this.today = now.toISOString().split('T')[0];
    this.username = localStorage.getItem('username') || '';
    this.driverId = localStorage.getItem('driverId') || '';
    this.email = localStorage.getItem('emergencyEmail') || '';
    this.isLoggedIn = !!localStorage.getItem('username');
    this.loadChatHistory();
    this.loadUserImage();   // Load image automatically
  }

  loadUserImage() {
    const userId = localStorage.getItem("driverId")

    const imgApi = `${environment.apiUrl}/user/${userId}/profile-image-base64`
    this.http.get(imgApi, { responseType: 'text' }).subscribe({
      next: (dataUri) => {
        if (dataUri && dataUri.startsWith("data")) {
          this.imageUrl = dataUri;

        } else {
          this.imageUrl = 'assets/default-user.jpg'; // fallback
        }
      },
      error: (err) => {
        console.error("Image fetch error:", err);
        this.imageUrl = 'assets/default-user.jpg';
      }
    });
  }

  //   goToPublishRide() {
  //   this.router.navigate(['/publish-ride']); // Replace with your route path
  // }

  showErrorAndRedirect(message: string) {
    this.toastMessage = message;
    this.toastType = 'error';
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
      // this.router.navigate(['/login']); // 🔥 redirect
    }, 2500);
  }

  closeAlert() {
    this.showToast = false;
  }


  searchRides() {
    // Build the payload to send to backend

    const token = localStorage.getItem('token');

    if (!token) {
      this.showErrorAndRedirect('Please login to search and book rides.');
      return;
    }
    const payload = {
      leavingFrom: this.leavingFrom,
      goingTo: this.goingTo,
      date: this.date,
      passengers: this.passengers
    };
    console.log(payload)
    const apiUrl = `${environment.apiUrl}/search`
    console.log(apiUrl)

    this.http.post<any[]>(apiUrl, payload)
      .subscribe(
        (results) => {

          console.log('Raw API response:', results);

          if (Array.isArray(results) && results.length > 0) {
            this.searchResults = results;
            this.noResultsMessage = '';
            console.log('✅ Search Results:', results);
          } else {
            this.searchResults = [];
            this.noResultsMessage = 'No rides found';
            console.log('⚠️ No rides found');
          }
          this.loading = false;
        },
        (error) => {
          console.error('Error fetching search results:', error);
          this.loading = false;
        }
      );
  }

  viewRideDetails(rideId: number) {
    // Pass the ride ID in the route
    this.router.navigate(['/ride', rideId]);

  }


  showProfile = false;
  userName = localStorage.getItem('username') || '';


  goToProfile() {

    this.router.navigate(['/profile'], { queryParams: { username: this.userName } });
  }

  goToMyRides() {

    this.router.navigate(['/my-rides'], { queryParams: { driverId: this.driverId } });
  }

  goToMyPublishRides() {

    this.router.navigate(['/my-publish-rides'], { queryParams: { driverId: this.driverId } })
  }

  checkDriverEligibility(userId: number) {

    console.log('Calling backend with userId:', userId);
    console.log(`${environment.apiUrl}/eligible/${userId}`)

    return this.http.get<any>(
      `${environment.apiUrl}/eligible/${userId}`
    );
  }

  goToPublishRide() {

    const idDriver = Number(localStorage.getItem('driverId'));

    console.log('DriverId:', idDriver);

    if (!idDriver || isNaN(idDriver)) {
      alert('Please login again');
      this.router.navigate(['/login']);
      return;
    }

    this.loading=true
    this.checkDriverEligibility(idDriver).subscribe({
      next: (res) => {
        console.log('Eligibility response:', res);

        if (res.eligible === true) {
          this.loading=false

          this.router.navigate(['/publish-ride'], {
            queryParams: { userId: idDriver }
          });
        } else {
this.loading=false
          // this.showErrorAndRedirect('Please register as a driver before publishing rides');
          this.router.navigate(['/driver-registration']);
        }
      },
      error: (err) => {
        this.loading=false
        console.error('Eligibility API error:', err);
        this.showErrorAndRedirect('Unable to check eligibility. Please try again later.');
      }
    });
  }


  logout() {
    localStorage.clear();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);


  }

  goToLogin() {
    this.router.navigate(['/login']);
  }


  triggerSOS() {

    console.log(this.email);
    const username = localStorage.getItem('username')
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const payload = {
            email: this.email,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            username: username
          };
          console.log(payload)

          const apiUrl = `${environment.apiUrl}/alert`


          this.http.post(apiUrl, payload, { responseType: 'text' },)
            .subscribe({
              next: (res) => {
                console.log("Backend:", res);
                alert(res); // shows exactly what backend sends
                this.loading = false;
              },
              error: (err) => {
                console.error(err);
                this.loading = false;
                this.showErrorAndRedirect('❌ Failed to send SOS alert. Please try again.');
              }
            });

        },
        (error) => {
          this.showErrorAndRedirect('⚠️ Unable to get your location. Please enable GPS.');
          this.loading = false;
        }
      );
    } else {
      this.showErrorAndRedirect('Geolocation not supported by your browser.');
      // this.showErrorAndRedirect('Please login to search and book rides.');
    }

  }



  searchPlaces(query: string, type: 'from' | 'to') {
    if (query.length < 2) return;

    // nt(query)}`;
    // const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}
    // &addressdetails=1&limit=5&countrycodes=in&accept-language=en`;


    // this.http.get<any[]>(url).subscribe((data) => {
    //   if (type === 'from') this.fromSuggestions = data;
    //   else this.toSuggestions = data;
    // });
    // this.http.get<any[]>(url).subscribe((data) => {
    // const formattedData = data.map(place => {
    //   const { city, town, village, state } = place.address;
    //   const formattedName = `${city || town || village || place.display_name}, ${state ?? ''}`;
    //   return { ...place, formattedName };
    // });
    const formattedData = this.placesList.filter(place =>
      place.toLowerCase().includes(query.toLowerCase())
    );

    if (type === 'from') this.fromSuggestions = formattedData;
    else this.toSuggestions = formattedData;
  }


  selectPlace(place: string, type: 'from' | 'to') {
    if (type === 'from') {
      this.leavingFrom = place;
      this.fromSuggestions = [];
    } else {
      this.goingTo = place;
      this.toSuggestions = [];
    }
  }


}
