import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Screenplay } from 'src/app/model/screenplay';
import { SearchService } from 'src/app/service/search.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  router: Router | undefined;
  keyword: string = '';
  searchType: string = 'Movies';
  searchService: SearchService | undefined;
  searchResults: Screenplay[] | undefined;

  constructor(_searchService: SearchService, _router: Router) {
    this.searchService = _searchService;
    this.router = _router;
  }

  /**
   * If available, loads the search results of the previous query from the local storage
   */
  ngOnInit(): void {
    this.searchResults = JSON.parse(
      localStorage.getItem('searchResults') || '{}'
    );
  }

  /**
   * When the keyword is submitted, calls the SearchService to get the matching movies or shows
   */
  onSearchSubmitted(): void {
    if (this.searchType === 'Movies') {
      this.searchService
        ?.executeQueryOnMovies(this.keyword)
        ?.subscribe((res) => {
          if (typeof res === 'undefined') {
            console.log('error when submitting search');
          } else {
            this.searchResults = res;
            localStorage.setItem(
              'searchResults',
              JSON.stringify(this.searchResults)
            );
          }
        });
    } else {
      this.searchService
        ?.executeQueryOnShows(this.keyword)
        ?.subscribe((res) => {
          if (typeof res === 'undefined') {
            console.log('error when submitting search');
          } else {
            this.searchResults = res;
            localStorage.setItem(
              'searchResults',
              JSON.stringify(this.searchResults)
            );
          }
        });
    }
  }

  /**
   * Navigate to the selected screenplay's details page
   * @param id Unique ID of the Movie/Show
   */
  cardClicked(id: string): void {
    this.router?.navigateByUrl(
      `/${this.searchType === 'Movies' ? 'movie' : 'show'}/${id}`
    );
  }
}
