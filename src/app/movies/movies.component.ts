import { Component } from '@angular/core';
import { MovieServiceService } from '../movie-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent {
  genres: { name: string; movies: { title: string; imageUrl: string; }[] }[] = [];
  thrillerMovies: { title: string; imageUrl: string }[] = [];
  comedyMovies:{title:string; imageUrl: string}[]=[];
  

  

  ngOnInit(): void {
    this.loadThrillerMovies();
    this.loadComedyMovies();
  }

  // Load movies dynamically
  // loadMovies(): void {
  //   this.genres = [
  //     {
  //       name: 'Action',
  //       movies: [
  //         { title: 'Mad Max: Fury Road', imageUrl: 'assets/movies/mad-max.jpg' },
  //         { title: 'John Wick', imageUrl: 'assets/movies/john-wick.jpg' },
  //         { title: 'The Dark Knight', imageUrl: 'assets/movies/dark-knight.jpg' }
  //       ]
  //     },
  //     {
  //       name: 'Comedy',
  //       movies: [
  //         { title: 'The Hangover', imageUrl: 'assets/movies/hangover.jpg' },
  //         { title: 'Superbad', imageUrl: 'assets/movies/superbad.jpg' },
  //         { title: 'Step Brothers', imageUrl: 'assets/movies/step-brothers.jpg' }
  //       ]
  //     },
  //     {
  //       name: 'Thriller',
  //       movies: [
  //         { title: 'Inception', imageUrl: 'assets/movies/inception.jpg' },
  //         { title: 'Seven', imageUrl: 'assets/movies/seven.jpg' },
  //         { title: 'Gone Girl', imageUrl: 'assets/movies/gone-girl.jpg' }
  //       ]
  //     }
  //   ];
  // }

  loadThrillerMovies(): void {
    this.thrillerMovies = [
      { title: 'Inception', imageUrl: 'assets/logo/images.png' },
      { title: 'Seven', imageUrl: 'assets/logo/images.png' },
      { title: 'Gone Girl', imageUrl: 'assets/logo/images.png' }
    ];
  }

  loadComedyMovies(): void {
    this.comedyMovies = [
      { title: 'Inception', imageUrl: 'assets/logo/images.png' },
      { title: 'Seven', imageUrl: 'assets/logo/images.png' },
      { title: 'Gone Girl', imageUrl: 'assets/logo/images.png' }
    ];
  }

  // View movie details
  // viewDetails(movie: { title: string; imageUrl: string }): void {
  //   alert(`You selected: ${movie.title}`);
  // }

  movies = [
    { title: 'Pushpa', imageUrl: 'assets/icons/lancohill.png' },
    { title: 'Basha', imageUrl: 'assets/icons/lancohill.png' },
    // Add more movies as needed
  ];

  constructor(private router: Router, private movieService: MovieServiceService) {}

  viewDetails(title: string) {
    // this.movieService.getMovieByTitle(title).subscribe((movie: any) => {
    //   // Navigate to 'movie-view' route with the movie data passed via state
    //   this.router.navigate(['/movie-view', title], { state: { movie } });
    // });
  }

}
