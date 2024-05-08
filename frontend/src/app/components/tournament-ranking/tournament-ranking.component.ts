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
  protected tournamentRanking: SerieRankingModel[][];
  protected tournamentStepValue: { index: number; label: string }[] = [];
  protected playerId: string;
  protected step: number;

  constructor(
    protected battleInstanceQueriesService: BattleInstanceQueriesService,
    protected playerService: PlayerService,
    protected destroyRef: DestroyRef
  ) {}

  public ngOnInit(): void {
    if (this.competition().type === CompetitionType.TOURNAMENT) {
      this.battleInstanceQueriesService
        .getTournamentRanking(this.competition().tournament)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((res) => {
          this.tournamentRanking = res.tournamentRanking;
          this.step = res.step;
          this.getTournamentStepValues();
        });
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
    let currentStep = this.step - 1;
    for (let i = 0; i < this.tournamentRanking.length; i++) {
      this.tournamentStepValue.push({
        index: i,
        label: this.tournamentStepValues.at(currentStep),
      });
      currentStep -= 1;
    }
  }
}
