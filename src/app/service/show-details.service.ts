import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { apiRoot, clientId } from '../constants';
import { Season } from '../model/season';
import { ShowDetails } from '../model/showDetails';

@Injectable({
  providedIn: 'root',
})
export class ShowDetailsService {
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
   * Calls the TraktAPI to get detailed information about a show
   * @param showId Unique ID of the Show
   * @returns Details of the Show (title, release date, etc.)
   */
  getDetailsOfShow(showId: string): Observable<ShowDetails> | undefined {
    let apiURL = `${apiRoot}/shows/${showId}?extended=full`;
    let results: Observable<ShowDetails> | undefined = this.http
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
            network: res.network,
            overview: res.overview,
            rating: res.rating,
            genres: res.genres,
          } as ShowDetails;
        })
      );
    return results;
  }

  /**
   * Calls the TraktAPI to get the seasons and episodes of a show
   * @param showId Unique ID of the Show
   * @returns Obesrvable list of seasons containing the episodes of the show
   */
  getEpisodesOfShow(showId: string): Observable<Season[]> | undefined {
    let apiURL = `${apiRoot}/shows/${showId}/seasons?extended=episodes`;
    let results: Observable<Season[]> | undefined = this.http
      ?.get(apiURL, this.options)
      .pipe(
        map((res: any) => {
          return res.map((item: any) => {
            return {
              number: item.number,
              ids: {
                trakt: item.ids.trakt,
                imdb: item.ids.imdb,
                tmdb: item.ids.tmdb,
              },
              episodes: item.episodes.map((episode: any) => {
                return {
                  number: episode.number,
                  title: episode.title,
                };
              }),
            } as Season;
          });
        })
      );
    return results;
  }
}
