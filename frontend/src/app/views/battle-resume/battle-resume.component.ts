import { Component, DestroyRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BattleModel } from '../../models/Battle.model';
import { BattleInstanceQueriesService } from '../../services/queries/battle-instance-queries.service';
import { switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TrainerQueriesService } from '../../services/queries/trainer-queries.service';
import { RouterService } from '../../services/router.service';
import { TrainerNameComponent } from '../../components/trainer-name/trainer-name.component';
import { DisplayPokemonImageComponent } from '../../components/display-pokemon-image/display-pokemon-image.component';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-battle-resume',
  templateUrl: './battle-resume.component.html',
  styleUrls: ['./battle-resume.component.scss'],
  standalone: true,
  imports: [
    TrainerNameComponent,
    DisplayPokemonImageComponent,
    MatIconModule,
    TranslateModule,
    NgClass,
    NgForOf,
    MatButtonModule,
    NgIf,
  ],
})
export class BattleResumeComponent implements OnInit {
  protected battle: BattleModel;

  public constructor(
    protected route: ActivatedRoute,
    protected router: RouterService,
    protected battleQueries: BattleInstanceQueriesService,
    protected trainerQueriesService: TrainerQueriesService,
    protected destroyRef: DestroyRef
  ) {}

  public ngOnInit(): void {
    this.route.queryParams
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((params) => {
          return this.battleQueries.get(params['battle']);
        }),
        switchMap((battle) => {
          this.battle = battle;
          return this.trainerQueriesService.list({
            ids: [battle.player._id, battle.opponent._id],
          });
        }),
        tap((result) => {
          result.map((trainer) => {
            trainer.pokemons = trainer.pokemons.filter(
              (pokemon) => pokemon.level > 0
            );
          });
          this.battle.player = result[0];
          this.battle.opponent = result[1];
        })
      )
      .subscribe();
  }

  protected backHome(): void {
    this.router.navigate(['home']);
  }
}
