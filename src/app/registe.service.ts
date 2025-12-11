import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisteService {

  // private registerUrl = 'http://localhost:8095/login/register'; // Replace with your API endpoint

   private registerUrl =
  window.location.hostname === 'localhost'
    ? 'https://uptight-freda-equinely.ngrok-free.dev/login/register'
    : 'https://uptight-freda-equinely.ngrok-free.dev/login/register';

  
  constructor(private http: HttpClient) {}

  createUser(userData: any): Observable<any> {
    return this.http.post(this.registerUrl, userData, { responseType: 'text' });
}
}
