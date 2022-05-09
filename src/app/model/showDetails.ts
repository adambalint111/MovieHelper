export interface ShowDetails {
  title: string;
  year: number;
  ids: {
    trakt: number;
    slug: string;
    imdb: string;
    tmdb: number;
  };
  network: string;
  overview: string;
  rating: number;
  genres: string[];
}
