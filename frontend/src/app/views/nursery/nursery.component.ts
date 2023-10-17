import { Component, DestroyRef, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { PlayerService } from '../../services/player.service';
import { NurseryQueriesService } from '../../services/queries/nursery-queries.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';
import { NurseryModel } from '../../models/nursery.model';
import { MatDialog } from '@angular/material/dialog';
import { NurseryWishlistFormComponent } from '../../modals/nursery-wishlist-form/nursery-wishlist-form.component';
import { NgForOf, NgIf } from '@angular/common';
import { DisplayPokemonImageComponent } from '../../components/display-pokemon-image/display-pokemon-image.component';
import { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import { PokemonQueriesService } from '../../services/queries/pokemon-queries.service';
@Component({
  selector: 'pm-nursery',
  standalone: true,
  imports: [
    MatButtonModule,
    TranslateModule,
    NgForOf,
    NgIf,
    DisplayPokemonImageComponent,
    NurseryWishlistFormComponent,
  ],
  templateUrl: './nursery.component.html',
  styleUrls: ['./nursery.component.scss'],
})
export class NurseryComponent implements OnInit {
  protected nursery: NurseryModel;
  constructor(
    protected playerService: PlayerService,
    protected nurseryQueriesService: NurseryQueriesService,
    protected destroyRef: DestroyRef,
    protected dialog: MatDialog,
    protected pokemonQueriesService: PokemonQueriesService
  ) {}

  public ngOnInit(): void {
    this.playerService.player$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((player) => {
          if (!player) {
            return of(null);
          }
          return this.nurseryQueriesService.get(player.nursery);
        })
      )
      .subscribe((nursery) => {
        this.nursery = nursery;
      });
  }

  protected nurseryWishlist(): void {
    this.dialog.open(NurseryWishlistFormComponent);
  }

  protected release(egg: PokemonModel): void {
    this.pokemonQueriesService
      .delete(egg._id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.nursery.eggs = this.nursery.eggs.filter(
          (pokemon) => pokemon._id !== egg._id
        );
      });
  }
}
