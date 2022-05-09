import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { apiRoot, clientId } from '../constants';
import { Cast } from '../model/cast';
import { MovieDetails } from '../model/movieDetails';

@Injectable({
  providedIn: 'root',
})
export class MovieDetailsService {
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
   * Calls the TraktAPI to get detailed information about a Movie
   * @param movieId Unique ID of the Movie
   * @returns Details of the Movie (title, release date, etc.)
   */
  getDetailsOfMovie(movieId: string): Observable<MovieDetails> | undefined {
    let apiURL = `${apiRoot}/movies/${movieId}?extended=full`;
    let results: Observable<MovieDetails> | undefined = this.http
      ?.get(apiURL, this.options)
      .pipe(
        map((res: any) => {
          return {
            title: res.title,
            year: res.year,
            ids: {
              trakt: res.ids.trakt,
              slug: res.ids.slug,
              imdb: res.ids.imdb,
              tmdb: res.ids.tmdb,
            },
            tagline: res.tagline,
            overview: res.overview,
            released: res.released,
            runtime: res.runtime,
            rating: res.rating,
            genres: res.genres,
          } as MovieDetails;
        })
      );
    return results;
  }

  /**
   * Calls the TraktAPI to get the cast of a Movie
   * @param movieId Unique ID of the Movie
   * @returns Cast of the Movie (Actor - character pairs)
   */
  getCastOfMovie(movieId: string): Observable<Cast[]> | undefined {
    let apiURL = `${apiRoot}/movies/${movieId}/people`;
    let results: Observable<Cast[]> | undefined = this.http
      ?.get(apiURL, this.options)
      .pipe(
        map((res: any) => {
          return res.cast.map((item: any) => {
            return {
              character: item.character,
              person: {
                name: item.person.name,
                ids: {
                  trakt: item.person.ids.trakt,
                  slug: item.person.ids.slug,
                  imdb: item.person.ids.imdb,
                  tmdb: item.person.ids.tmdb,
                },
              },
            } as Cast;
          });
        })
      );
    return results;
  }
}
