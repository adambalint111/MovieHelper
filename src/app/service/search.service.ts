import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, forkJoin } from 'rxjs';
import { apiRoot, clientId } from '../constants';
import { Movie } from '../model/movie';
import { Screenplay } from '../model/screenplay';
import { Show } from '../model/show';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'trakt-api-version': '2',
      'trakt-api-key': clientId,
    }),
  };

  http: HttpClient | undefined;

  constructor(_http: HttpClient) {
    this.http = _http;
  }

  /**
   * Calls the TraktAPI to search for movies matching a specified keyword
   * @param keyword Keyword for the movies to match
   * @returns Observable list of matching movies
   */
  executeQueryOnMovies(keyword: string): Observable<Screenplay[]> | undefined {
    let apiURL = `${apiRoot}/search/movie?query=${keyword}&limit=50`;
    let results: Observable<Screenplay[]> | undefined = this.http
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
   * Calls the TraktAPI to search for shows matching a specified keyword
   * @param keyword Keyword for the shows to match
   * @returns Observable list of matching shows
   */
  executeQueryOnShows(keyword: string): Observable<Screenplay[]> | undefined {
    let apiURL = `${apiRoot}/search/show?query=${keyword}&limit=50`;
    let results: Observable<Screenplay[]> | undefined = this.http
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
