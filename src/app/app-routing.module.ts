import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomepageComponent } from './homepage/homepage.component';
import { RegisterComponent } from './register/register.component';
import { MoviesComponent } from './movies/movies.component';
import { ProfileComponent } from './profile/profile.component';
import { RideDetailsComponent } from './ride-details/ride-details.component';
import { PublishRideComponent } from './publish-ride/publish-ride.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
   // Redirect to login
  { path: 'login', component: LoginComponent },
  { path: 'ride/:id', component: RideDetailsComponent },
  { path: 'home', component: HomepageComponent },
  {path: 'register',component:RegisterComponent},
  {path: 'movies',component:MoviesComponent},
  {path:'profile',component:ProfileComponent},
  { path: 'publish-ride', component: PublishRideComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

