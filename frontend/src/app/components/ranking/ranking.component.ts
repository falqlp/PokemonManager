import { Component, DestroyRef, input, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { TimeService } from '../../services/time.service';
import { Observable, of, switchMap } from 'rxjs';
import { RankingModel } from '../../models/ranking.model';
import { BattleInstanceQueriesService } from '../../services/queries/battle-instance-queries.service';
import { PlayerService } from '../../services/player.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgClass } from '@angular/common';
import {
  CompetitionModel,
  CompetitionType,
} from '../../models/competition.model';
import { CompetitionHistoryModel } from '../../models/competition-history.model';

@Component({
  selector: 'pm-ranking',
  standalone: true,
  imports: [MatTableModule, TranslateModule, NgClass],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.scss',
})
export class RankingComponent implements OnInit {
  public competition = input<CompetitionModel>();
  public competitionHistory = input<CompetitionHistoryModel>();
  protected displayedColumns: string[] = [
    'ranking',
    'class',
    'name',
    'wins',
    'losses',
    'winPercentage',
  ];

  protected playerId: string;

  protected ranking$: Observable<RankingModel[]>;

  constructor(
    protected timeService: TimeService,
    protected battleInstanceQueriesService: BattleInstanceQueriesService,
    protected playerService: PlayerService,
    protected destroyRef: DestroyRef
  ) {}

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
