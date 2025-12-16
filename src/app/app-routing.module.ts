import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomepageComponent } from './homepage/homepage.component';
import { RegisterComponent } from './register/register.component';

import { ProfileComponent } from './profile/profile.component';
import { RideDetailsComponent } from './ride-details/ride-details.component';
import { PublishRideComponent } from './publish-ride/publish-ride.component';
import { MyRidesComponent } from './my-rides/my-rides.component';
import { DriverPublishRidesComponent } from './driver-publish-rides/driver-publish-rides.component';
import { ViewRideDetailsComponent } from './view-ride-details/view-ride-details.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { StartRideComponent } from './start-ride/start-ride.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
   // Redirect to login
  { path: 'login', component: LoginComponent },
  { path: 'ride/:id', component: RideDetailsComponent },
  { path: 'home', component: HomepageComponent },
  {path: 'register',component:RegisterComponent},
  {path:'profile',component:ProfileComponent},
  {path: 'publish-ride', component: PublishRideComponent },
  {path:'my-rides',component:MyRidesComponent},
  {path:'my-publish-rides',component:DriverPublishRidesComponent},
  {path:'view-details/:rideId',component:ViewRideDetailsComponent},
  {path:'forgot-password',component:ForgetPasswordComponent},
  {path:'start-ride/:rideId',component:StartRideComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

