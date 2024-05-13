import { Component, DestroyRef, input, OnInit } from '@angular/core';
import { BattleInstanceQueriesService } from '../../services/queries/battle-instance-queries.service';
import {
  CompetitionModel,
  CompetitionType,
} from '../../models/competition.model';
import { SerieRankingModel } from '../../models/ranking.model';
import { PlayerService } from '../../services/player.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { TrainerNameComponent } from '../trainer-name/trainer-name.component';
import { MatListModule } from '@angular/material/list';
import { NgClass } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { CompetitionHistoryModel } from '../../models/competition-history.model';
import { TimeService } from '../../services/time.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'pm-tournament-ranking',
  standalone: true,
  imports: [
    TranslateModule,
    TrainerNameComponent,
    MatListModule,
    NgClass,
    MatTabsModule,
  ],
  templateUrl: './tournament-ranking.component.html',
  styleUrl: './tournament-ranking.component.scss',
})
export class TournamentRankingComponent implements OnInit {
  private readonly tournamentStepValues = [
    'FINAL',
    'SEMI-FINAL',
    'QUARTER-FINAL',
    'ROUND_OF_16',
    'ROUND_OF_32',
  ];

  public competition = input<CompetitionModel>();
  public competitionHistory = input<CompetitionHistoryModel>();
  public full = input<boolean>(false);
  protected tournamentRanking: SerieRankingModel[][];
  protected tournamentStepValue: { index: number; label: string }[] = [];
  protected playerId: string;
  protected step: number;

  constructor(
    protected battleInstanceQueriesService: BattleInstanceQueriesService,
    protected playerService: PlayerService,
    protected destroyRef: DestroyRef,
    private timeService: TimeService
  ) {}

  public ngOnInit(): void {
    if (this.competitionHistory()) {
      const competitionHistory = this.competitionHistory();
      if ('tournament' in competitionHistory) {
        this.tournamentRanking = competitionHistory.tournament;
        this.step = competitionHistory.tournament.length;
        this.getTournamentStepValues();
      }
    } else {
      if (this.competition().type === CompetitionType.TOURNAMENT) {
        this.timeService
          .getActualDate()
          .pipe(
            takeUntilDestroyed(this.destroyRef),
            switchMap(() =>
              this.battleInstanceQueriesService.getTournamentRanking(
                this.competition().tournament
              )
            )
          )
          .subscribe((res) => {
            this.tournamentRanking = res.tournamentRanking;
            this.step = res.step;
            this.getTournamentStepValues();
          });
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

  private getTournamentStepValues(): void {
    this.tournamentStepValue = [];
    let currentStep = this.step - 1;
    for (let i = 0; i < this.tournamentRanking.length; i++) {
      this.tournamentStepValue.push({
        index: i,
        label: this.tournamentStepValues.at(currentStep),
      });
      currentStep -= 1;
    }
    this.tournamentRanking = this.tournamentRanking.map(this.rearrangePairs);
  }

  private rearrangePairs<T>(pairs: T[]): T[] {
    if (pairs.length === 1) {
      return pairs;
    }
    const result = [];
    const n = pairs.length;

    result.push(pairs[0]);
    result.push(pairs[n - 1]);

    let left = 1;
    let right = n - 2;

    while (result.length < n) {
      if (left <= right) {
        result.push(pairs[left]);
        left += 1;
      }
      if (left <= right) {
        result.push(pairs[right]);
        right -= 1;
      }
    }

    return result;
  }
}
