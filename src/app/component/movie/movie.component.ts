import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Cast } from 'src/app/model/cast';
import { MovieDetails } from 'src/app/model/movieDetails';
import { MovieDetailsService } from 'src/app/service/movie-details.service';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css'],
})
export class MovieComponent implements OnInit {
  activatedRoute: ActivatedRoute | undefined;
  router: Router | undefined;
  movieId: string | undefined;
  movieDetailsService: MovieDetailsService | undefined;
  movieDetails: MovieDetails | undefined;
  cast: MatTableDataSource<Cast> | undefined;

  constructor(
    _movieDetailsService: MovieDetailsService,
    _activatedRoute: ActivatedRoute,
    _router: Router
  ) {
    this.movieDetailsService = _movieDetailsService;
    this.activatedRoute = _activatedRoute;
    this.router = _router;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  /**
   * Gets the movie's ID from the URL, and gets the details of the movie
   */
  ngOnInit(): void {
    this.activatedRoute?.params.subscribe((params) => {
      this.movieId = params['id'];
      this.getMovieDetails();
      this.getMovieCast();
    });
  }

  /**
   * Calls the MovieDetailsService to get the details of the movie
   */
  getMovieDetails(): void {
    this.movieDetailsService
      ?.getDetailsOfMovie(this.movieId || '')
      ?.subscribe((res) => {
        if (typeof res === 'undefined') {
          console.log('error');
        } else {
          this.movieDetails = res;
        }
      });
  }

  /**
   * Calls the MovieDetailsService to get the cast of the movie
   */
  getMovieCast(): void {
    this.movieDetailsService
      ?.getCastOfMovie(this.movieId || '')
      ?.subscribe((res) => {
        if (typeof res === 'undefined') {
          console.log('error');
        } else {
          this.cast = new MatTableDataSource(res);
          this.cast.paginator = this.paginator!;
        }
      });
  }

  /**
   * Navigate to the selected actor's details page
   * @param actorId Unique ID of the actor
   */
  onActorClicked(actorId: string): void {
    this.router?.navigateByUrl(`/actor/${actorId}`);
  }
}
