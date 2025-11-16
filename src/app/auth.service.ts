import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private userUrl = 'https://spring-boot-crud-3qhx.onrender.com/login/login';
  // private userUrl = 'http://localhost:8095/login/login';
  private userUrl = environment.apiUrl + '/login/login';



  constructor(private http: HttpClient) { }

  login(username: string , password:string):Observable<any>{
    const payload = { username, password };
    console.log(payload)
    return this.http.post<any>(this.userUrl, { username, password }).pipe(
    
      
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server error: ${error.status} - ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
