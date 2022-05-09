import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { apiRoot, clientId } from '../constants';
import { Genre } from '../model/genre';
import { Movie } from '../model/movie';
import { Show } from '../model/show';

@Injectable({
  providedIn: 'root',
})
export class RecommendationService {
  http: HttpClient | undefined;
  options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'trakt-api-version': '2',
      'trakt-api-key': clientId,
    }),
  };
  constructor(_http: HttpClient) {
    this.http = _http;
  }

  /**
   * Calls the TraktAPI to get the available genres
   * @param searchType Type of genre (Movie / Show)
   * @returns Observable list of the available genres
   */
  getAllGenres(searchType: string): Observable<Genre[]> | undefined {
    let apiURL = `${apiRoot}/genres/${searchType}`;
    let results: Observable<Genre[]> | undefined = this.http
      ?.get(apiURL, this.options)
      .pipe(
        map((res: any) => {
          return res.map((item: any) => {
            return {
              name: item.name,
              slug: item.slug,
            } as Genre;
          });
        })
      );
    return results;
  }

  /**
   * Calls the TraktAPI to get the recommended/trending movies with the desired genre
   * @param genre The movies' genre
   * @returns Observable list of movies
   */
  getRecommendedMovies(genre: string): Observable<Movie[]> | undefined {
    let apiURL = `${apiRoot}/movies/trending?genres=${genre}&limit=50`;
    let results: Observable<Movie[]> | undefined = this.http
      ?.get(apiURL, this.options)
      .pipe(
        map((res: any) => {
          return res.map((item: any) => {
            return {
              title: item.movie.title,
              year: item.movie.year,
              ids: {
                trakt: item.movie.ids.trakt,
                slug: item.movie.ids.slug,
                imdb: item.movie.ids.imdb,
                tmdb: item.movie.ids.tmdb,
              },
            } as Movie;
          });
        })
      );
    return results;
  }

  /**
   * Calls the TraktAPI to get the recommended/trending shows with the desired genre
   * @param genre The shows' genre
   * @returns Observable list of shows
   */
  getRecommendedShows(genre: string): Observable<Show[]> | undefined {
    let apiURL = `${apiRoot}/shows/trending?genres=${genre}&limit=50`;
    let results: Observable<Show[]> | undefined = this.http
      ?.get(apiURL, this.options)
      .pipe(
        map((res: any) => {
          return res.map((item: any) => {
            return {
              title: item.show.title,
              year: item.show.year,
              ids: {
                trakt: item.show.ids.trakt,
                slug: item.show.ids.slug,
                imdb: item.show.ids.imdb,
                tmdb: item.show.ids.tmdb,
              },
            } as Show;
          });
        })
      );
    return results;
  }
}
