import { NestedTreeControl } from '@angular/cdk/tree';
import { identifierName } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';
import { Season } from 'src/app/model/season';
import { ShowDetails } from 'src/app/model/showDetails';
import { ShowDetailsService } from 'src/app/service/show-details.service';

interface TreeNode {
  name: string;
  children: TreeNode[];
}

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css'],
})
export class ShowComponent implements OnInit {
  activatedRoute: ActivatedRoute | undefined;
  router: Router | undefined;
  showId: string | undefined;
  showDetailsService: ShowDetailsService | undefined;
  showDetails: ShowDetails | undefined;
  seasons: Season[] | undefined;
  dataSource = new MatTreeNestedDataSource<TreeNode>();
  treeControl = new NestedTreeControl<TreeNode>((node) => node.children);

  constructor(
    _showDetailsService: ShowDetailsService,
    _activatedRoute: ActivatedRoute,
    _router: Router
  ) {
    this.showDetailsService = _showDetailsService;
    this.activatedRoute = _activatedRoute;
    this.router = _router;
  }

  /**
   * Gets the show's ID from the URL, and gets the details of the show
   */
  ngOnInit(): void {
    this.activatedRoute?.params.subscribe((params) => {
      this.showId = params['id'];
      this.getShowDetails();
      this.getSeasons();
    });
  }

  /**
   * Calls the ShowDetailsService to get the details of the show
   */
  getShowDetails(): void {
    this.showDetailsService
      ?.getDetailsOfShow(this.showId || '')
      ?.subscribe((res) => {
        if (typeof res === 'undefined') {
          console.log('error');
        } else {
          this.showDetails = res;
        }
      });
  }

  /**
   * Calls the ShowDetailsService to get the seasons and episodes of the show
   */
  getSeasons(): void {
    this.showDetailsService
      ?.getEpisodesOfShow(this.showId || '')
      ?.subscribe((res) => {
        if (typeof res === 'undefined') {
          console.log('error');
        } else {
          this.seasons = res;
          this.dataSource.data = this.transformSeasonsToNodes();
        }
      });
  }

  /**
   * Determines if the node should be nested or not
   * @param node Current TreeNode
   * @returns True if the node has children, false if not
   */
  hasChild = (_: number, node: TreeNode) =>
    !!node.children && node.children.length > 0;

  /**
   * Transforms the Season objects into TreeNodes, so they can be displayed
   * @returns Array of TreeNodes which can be represented in the Tree control
   */
  private transformSeasonsToNodes(): TreeNode[] {
    return this.seasons!.map((season) => {
      return {
        name: `Season ${season.number}`,
        children: season.episodes.map((episode) => {
          return {
            name: `${episode.number} - ${episode.title}`,
          } as TreeNode;
        }),
      } as TreeNode;
    });
  }
}
