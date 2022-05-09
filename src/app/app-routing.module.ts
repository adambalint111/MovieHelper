import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActorComponent } from './component/actor/actor.component';
import { HomeComponent } from './component/home/home.component';
import { MovieComponent } from './component/movie/movie.component';
import { MoviesComponent } from './component/movies/movies.component';
import { ShowComponent } from './component/show/show.component';
import { ShowsComponent } from './component/shows/shows.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'movies', component: MoviesComponent },
  { path: 'movie/:id', component: MovieComponent },
  { path: 'shows', component: ShowsComponent },
  { path: 'show/:id', component: ShowComponent },
  { path: 'actor/:id', component: ActorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
