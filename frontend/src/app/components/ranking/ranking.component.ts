import { Component, DestroyRef, input, OnInit, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { TimeService } from '../../services/time.service';
import { Observable, of, switchMap } from 'rxjs';
import { RankingModel } from '../../models/ranking.model';
import { BattleInstanceQueriesService } from '../../services/queries/battle-instance-queries.service';
import { NgClass } from '@angular/common';
import {
  CompetitionModel,
  CompetitionType,
} from '../../models/competition.model';
import { CompetitionHistoryModel } from '../../models/competition-history.model';
import { RankingBaseComponent } from './ranking-base/ranking-base.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'pm-ranking',
  standalone: true,
  imports: [MatTableModule, TranslateModule, NgClass, RankingBaseComponent],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.scss',
})
export class RankingComponent implements OnInit {
  private timeService = inject(TimeService);
  private battleInstanceQueriesService = inject(BattleInstanceQueriesService);
  private playerService = inject(PlayerService);
  private destroyRef = inject(DestroyRef);

  public competition = input<CompetitionModel>();
  public competitionHistory = input<CompetitionHistoryModel>();
  protected playerId: string;

  protected ranking$: Observable<RankingModel[]>;

  public ngOnInit(): void {
    if (this.competitionHistory()) {
      const competitionHistory = this.competitionHistory();
      if ('ranking' in competitionHistory) {
        this.ranking$ = of(competitionHistory.ranking);
      }
    } else {
      if (this.competition().type === CompetitionType.CHAMPIONSHIP) {
        this.ranking$ = this.timeService.getActualDate().pipe(
          switchMap(() => {
            return this.battleInstanceQueriesService.getRanking(
              this.competition()._id
            );
          })
        );
      }
    }
    this.playerService.player$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((player) => {
        if (player) {
          this.playerId = player._id;
        }
      });
  }
}
