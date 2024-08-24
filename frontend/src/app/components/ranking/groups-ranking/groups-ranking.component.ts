import { Component, DestroyRef, input, OnInit, inject } from '@angular/core';
import {
  CompetitionModel,
  CompetitionType,
} from '../../../models/competition.model';
import { TimeService } from '../../../services/time.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, Observable, of, switchMap } from 'rxjs';
import { BattleInstanceQueriesService } from '../../../services/queries/battle-instance-queries.service';
import { RankingModel } from '../../../models/ranking.model';
import { MatTabsModule } from '@angular/material/tabs';
import { RankingBaseComponent } from '../ranking-base/ranking-base.component';
import { TranslateModule } from '@ngx-translate/core';
import { PlayerService } from '../../../services/player.service';
import { CompetitionHistoryModel } from '../../../models/competition-history.model';

@Component({
  selector: 'pm-groups-ranking',
  standalone: true,
  imports: [MatTabsModule, RankingBaseComponent, TranslateModule],
  templateUrl: './groups-ranking.component.html',
  styleUrl: './groups-ranking.component.scss',
})
export class GroupsRankingComponent implements OnInit {
  private timeService = inject(TimeService);
  private destroyRef = inject(DestroyRef);
  private battleInstanceQueriesService = inject(BattleInstanceQueriesService);
  private playerService = inject(PlayerService);

  public competition = input<CompetitionModel>();
  public competitionHistory = input<CompetitionHistoryModel>();
  protected rankings: Observable<RankingModel[]>[] = [];
  protected selectedIndex = 0;
  protected playerId: string;

  public ngOnInit(): void {
    if (this.competition()) {
      this.timeService
        .getActualDate()
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          switchMap(() => {
            return this.playerService.player$.pipe(filter((value) => !!value));
          }),
          switchMap((player) => {
            this.playerId = player._id;
            return this.battleInstanceQueriesService.getGroupsRanking(
              this.competition()._id
            );
          })
        )
        .subscribe((result) => {
          const index = result.findIndex((val) =>
            val.find((value) => value._id === this.playerId)
          );
          if (index >= 0) {
            this.selectedIndex = index;
          }
          this.rankings = result.map((value) => {
            return of(value);
          });
        });
    } else if (this.competitionHistory()) {
      const competitionHistory = this.competitionHistory();
      if (competitionHistory.type === CompetitionType.GROUPS) {
        this.rankings = competitionHistory.groups.map((value) => {
          return of(value);
        });
        this.playerService.player$
          .pipe(
            takeUntilDestroyed(this.destroyRef),
            filter((value) => !!value)
          )
          .subscribe((player) => {
            this.playerId = player._id;
          });
      }
    }
  }
}
