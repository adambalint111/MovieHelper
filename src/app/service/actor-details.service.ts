import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { apiRoot, clientId } from '../constants';
import { ActorDetails } from '../model/actorDetails';
import { Role } from '../model/role';
import { Screenplay } from '../model/screenplay';

@Injectable({
  providedIn: 'root',
})
export class ActorDetailsService {
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
   * Calls the TraktAPI to get detailed information about an Actor
   * @param actorId Unique ID of the Actor
   * @returns Details of the Actor (name, birthday, etc.)
   */
  getDetailsOfActor(actorId: string): Observable<ActorDetails> | undefined {
    let apiURL = `${apiRoot}/people/${actorId}?extended=full`;
    let results: Observable<ActorDetails> | undefined = this.http
      ?.get(apiURL, this.options)
      .pipe(
        map((res: any) => {
          return {
            name: res.name,
            ids: {
              trakt: res.ids.trakt,
              slug: res.ids.slug,
              imdb: res.ids.imdb,
              tmdb: res.ids.tmdb,
            },
            biography: res.biography,
            birthday: res.birthday,
            death: res.death,
            birthplace: res.birthplace,
            gender: res.gender,
          } as ActorDetails;
        })
      );
    return results;
  }

  /**
   * Calls the TraktAPI to get the show credits of the specified Actor
   * @param actorId Unique ID of the Actor
   * @returns An observable collection of Roles (character - show pairs)
   */
  getRolesInShows(actorId: string): Observable<Role[]> | undefined {
    let apiURL = `${apiRoot}/people/${actorId}/shows`;
    let results: Observable<Role[]> | undefined = this.http
      ?.get(apiURL, this.options)
      .pipe(
        map((res: any) => {
          return res.cast.map((item: any) => {
            return {
              character: item.character,
              screenplay: item.show as Screenplay,
            } as Role;
          });
        })
      );
    return results;
  }

  /**
   * Calls the TraktAPI to get the movie credits of the specified Actor
   * @param actorId Unique ID of the Actor
   * @returns An observable collection of Roles (character - movie pairs)
   */
  getRolesInMovies(actorId: string): Observable<Role[]> | undefined {
    let apiURL = `${apiRoot}/people/${actorId}/movies`;
    let results: Observable<Role[]> | undefined = this.http
      ?.get(apiURL, this.options)
      .pipe(
        map((res: any) => {
          return res.cast.map((item: any) => {
            return {
              character: item.character,
              screenplay: item.movie as Screenplay,
            } as Role;
          });
        })
      );
    return results;
  }
}
