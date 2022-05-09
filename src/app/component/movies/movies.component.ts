import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Genre } from 'src/app/model/genre';
import { Movie } from 'src/app/model/movie';
import { RecommendationService } from 'src/app/service/recommendation.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css'],
})
export class MoviesComponent implements OnInit {
  router: Router | undefined;
  recommendationService: RecommendationService | undefined;
  activeGenre: Genre | undefined;
  genres: Genre[] | undefined;
  movies: Movie[] | undefined;

  constructor(_recommendationService: RecommendationService, _router: Router) {
    this.recommendationService = _recommendationService;
    this.router = _router;
    this.activeGenre = JSON.parse(localStorage.getItem('activeGenre') || '{}');
  }

  /**
   * Calls the recommendation service to get the available genres for movies
   * and gets the recommended movies by that genre
   */
  ngOnInit(): void {
    this.recommendationService?.getAllGenres('movies')?.subscribe((res) => {
      if (typeof res === 'undefined') {
        console.log('error');
      } else {
        this.genres = res;
      }
    });

    this.recommendationService
      ?.getRecommendedMovies(this.activeGenre?.slug || '')
      ?.subscribe((res) => {
        if (typeof res === 'undefined') {
          console.log('error');
        } else {
          this.movies = res;
        }
      });
  }

  /**
   * Regenerate the results by getting the recommended movies for the new genre
   * @param genre The clicked genre
   */
  onGenreClicked(genre: Genre): void {
    this.activeGenre = genre;
    localStorage.setItem('activeGenre', JSON.stringify(this.activeGenre));
    this.recommendationService
      ?.getRecommendedMovies(genre.slug)
      ?.subscribe((res) => {
        if (typeof res === 'undefined') {
          console.log('error');
        } else {
          this.movies = res;
        }
      });
  }

  /**
   * Navigate to the selected movie's details page
   * @param id Unique ID of the movie
   */
  onMovieClicked(id: string): void {
    this.router?.navigateByUrl(`/movie/${id}`);
  }
}
