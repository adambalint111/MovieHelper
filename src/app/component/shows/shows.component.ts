import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Genre } from 'src/app/model/genre';
import { Show } from 'src/app/model/show';
import { RecommendationService } from 'src/app/service/recommendation.service';

@Component({
  selector: 'app-shows',
  templateUrl: './shows.component.html',
  styleUrls: ['./shows.component.css'],
})
export class ShowsComponent implements OnInit {
  router: Router | undefined;
  recommendationService: RecommendationService | undefined;
  activeGenre: Genre | undefined;
  genres: Genre[] | undefined;
  shows: Show[] | undefined;

  constructor(_recommendationService: RecommendationService, _router: Router) {
    this.recommendationService = _recommendationService;
    this.router = _router;
    this.activeGenre = JSON.parse(localStorage.getItem('activeGenre') || '{}');
  }

  /**
   * Calls the recommendation service to get the available genres for shows
   * and gets the recommended shows by that genre
   */
  ngOnInit(): void {
    this.recommendationService?.getAllGenres('shows')?.subscribe((res) => {
      if (typeof res === 'undefined') {
        console.log('error');
      } else {
        this.genres = res;
      }
    });

    this.recommendationService
      ?.getRecommendedShows(this.activeGenre?.slug || '')
      ?.subscribe((res) => {
        if (typeof res === 'undefined') {
          console.log('error');
        } else {
          this.shows = res;
        }
      });
  }

  /**
   * Regenerate the results by getting the recommended shows for the new genre
   * @param genre The clicked genre
   */
  onGenreClicked(genre: Genre): void {
    this.activeGenre = genre;
    localStorage.setItem('activeGenre', JSON.stringify(this.activeGenre));
    this.recommendationService
      ?.getRecommendedShows(genre.slug)
      ?.subscribe((res) => {
        if (typeof res === 'undefined') {
          console.log('error');
        } else {
          this.shows = res;
        }
      });
  }

  /**
   * Navigate to the selected show's details page
   * @param id Unique ID of the show
   */
  onShowClicked(id: string): void {
    this.router?.navigateByUrl(`/show/${id}`);
  }
}
