import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';
import { ActorDetails } from 'src/app/model/actorDetails';
import { Role } from 'src/app/model/role';
import { ActorDetailsService } from 'src/app/service/actor-details.service';

interface TreeNode {
  name: string;
  id: string;
  type: string;
  children: TreeNode[];
}

@Component({
  selector: 'app-actor',
  templateUrl: './actor.component.html',
  styleUrls: ['./actor.component.css'],
})
export class ActorComponent implements OnInit {
  activatedRoute: ActivatedRoute | undefined;
  router: Router | undefined;
  actorId: string | undefined;
  actorDetailsService: ActorDetailsService | undefined;
  actorDetails: ActorDetails | undefined;
  movieRoles: Role[] | undefined;
  showRoles: Role[] | undefined;
  dataSource = new MatTreeNestedDataSource<TreeNode>();
  treeControl = new NestedTreeControl<TreeNode>((node) => node.children);

  constructor(
    _actorDetailsService: ActorDetailsService,
    _activatedRoute: ActivatedRoute,
    _router: Router
  ) {
    this.actorDetailsService = _actorDetailsService;
    this.activatedRoute = _activatedRoute;
    this.router = _router;
  }

  /**
   * Gets the actor's ID from the URL, and gets the details of the actor
   */
  ngOnInit(): void {
    this.activatedRoute?.params.subscribe((params) => {
      this.actorId = params['id'];
      this.getActorDetails();
      this.getRolesOfActor();
    });
  }

  /**
   * Calls the ActorDetailsService to get the details of the actor
   */
  getActorDetails(): void {
    this.actorDetailsService
      ?.getDetailsOfActor(this.actorId || '')
      ?.subscribe((res) => {
        if (typeof res === 'undefined') {
        } else {
          this.actorDetails = res;
        }
      });
  }

  /**
   * Calls the ActorDetailsService to get the movie and tv show credits/roles of the actor
   */
  getRolesOfActor(): void {
    this.actorDetailsService
      ?.getRolesInMovies(this.actorId || '')
      ?.subscribe((res) => {
        if (typeof res === 'undefined') {
          console.log('Actor Not Found');
        } else {
          this.movieRoles = res;
          this.actorDetailsService
            ?.getRolesInShows(this.actorId || '')
            ?.subscribe((res) => {
              if (typeof res === 'undefined') {
                console.log('Actor Not Found');
              } else {
                this.showRoles = res;
                this.dataSource.data = this.transformRolesToNodes();
              }
            });
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
   * Navigates to the selected screenplay's details page
   * @param node The clicked node
   */
  onNodeClicked(node: TreeNode): void {
    node.type === 'movie'
      ? this.onMovieClicked(node.id)
      : this.onShowClicked(node.id);
  }

  private onMovieClicked(movieId: string): void {
    this.router?.navigateByUrl(`/movie/${movieId}`);
  }

  private onShowClicked(showId: string): void {
    this.router?.navigateByUrl(`/show/${showId}`);
  }

  /**
   * Transforms the Role objects into TreeNodes, so they can be displayed
   * @returns Array of TreeNodes which can be represented in the Tree control
   */
  private transformRolesToNodes(): TreeNode[] {
    let movies = {
      name: 'Movies',
      children: this.movieRoles!.map((role) => {
        return {
          name: `${role.character} - ${role.screenplay.title}`,
          type: 'movie',
          id: role.screenplay.ids.slug,
        } as TreeNode;
      }),
    } as TreeNode;

    let shows = {
      name: 'Shows',
      children: this.showRoles!.map((role) => {
        return {
          name: `${role.character} - ${role.screenplay.title}`,
          type: 'show',
          id: role.screenplay.ids.slug,
        } as TreeNode;
      }),
    } as TreeNode;

    return [movies, shows];
  }
}
