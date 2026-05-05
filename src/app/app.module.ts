import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

/* Angular Material */
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/* Components */
import { LoginComponent } from './login/login.component';
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
import { DriverRegistrationComponent } from './driver-registration/driver-registration.component';

/* Interceptor */
import { AuthInterceptor } from './auth.interceptor';
import { ApproveRequestComponent } from './approve-request/approve-request.component';

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
    DriverRegistrationComponent,
    ApproveRequestComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    /* Material */
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
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
export class AppModule {}
