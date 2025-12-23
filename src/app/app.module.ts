import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomepageComponent } from './homepage/homepage.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { RideDetailsComponent } from './ride-details/ride-details.component';
import { PublishRideComponent } from './publish-ride/publish-ride.component';
import { MyRidesComponent } from './my-rides/my-rides.component';
import { DriverPublishRidesComponent } from './driver-publish-rides/driver-publish-rides.component';
import { ViewRideDetailsComponent } from './view-ride-details/view-ride-details.component';
import { LoaderComponent } from './loader/loader.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { StartRideComponent } from './start-ride/start-ride.component';
import { MatSelectModule } from '@angular/material/select';

import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthInterceptor } from './auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DriverRegistrationComponent } from './driver-registration/driver-registration.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomepageComponent,
    RegisterComponent,
    ProfileComponent,
    RideDetailsComponent,
    PublishRideComponent,
    MyRidesComponent,
    DriverPublishRidesComponent,
    ViewRideDetailsComponent,
    LoaderComponent,
    ForgetPasswordComponent,
    StartRideComponent,
    DriverRegistrationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
