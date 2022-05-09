export interface Season {
  number: number;
  ids: {
    trakt: number;
    imdb: string;
    tmdb: number;
  };
  episodes: [
    {
      number: number;
      title: string;
    }
  ];
}
