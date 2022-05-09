export interface ActorDetails {
  name: string;
  ids: {
    trakt: number;
    slug: string;
    imdb: string;
    tmdb: number;
  };
  biography: string;
  birthday: string;
  death: string;
  birthplace: string;
  gender: string;
}
