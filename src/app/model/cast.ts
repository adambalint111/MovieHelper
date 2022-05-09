export interface Cast {
  character: string;
  person: {
    name: string;
    ids: {
      trakt: number;
      slug: string;
      imdb: string;
      tmdb: number;
    };
  };
}
