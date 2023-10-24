import { Component, DestroyRef, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { PlayerService } from '../../services/player.service';
import { NurseryQueriesService } from '../../services/queries/nursery-queries.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';
import { NurseryModel } from '../../models/nursery.model';
import { NurseryWishlistFormComponent } from './nursery-wishlist-form/nursery-wishlist-form.component';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { DisplayPokemonImageComponent } from '../../components/display-pokemon-image/display-pokemon-image.component';
import { NurseryPokemonListComponent } from './nursery-pokemon-list/nursery-pokemon-list.component';
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
    NgClass,
    NurseryPokemonListComponent,
  ],
  templateUrl: './nursery.component.html',
  styleUrls: ['./nursery.component.scss'],
})
export class NurseryComponent implements OnInit {
  protected nursery: NurseryModel;
  constructor(
    protected playerService: PlayerService,
    protected nurseryQueriesService: NurseryQueriesService,
    protected destroyRef: DestroyRef
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
}
