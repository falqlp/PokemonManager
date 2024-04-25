import { Component, DestroyRef, input, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { TimeService } from '../../services/time.service';
import { Observable, switchMap } from 'rxjs';
import { RankingModel } from '../../models/ranking.model';
import { BattleInstanceQueriesService } from '../../services/queries/battle-instance-queries.service';
import { PlayerService } from '../../services/player.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgClass } from '@angular/common';

@Component({
  selector: 'pm-ranking',
  standalone: true,
  imports: [MatTableModule, TranslateModule, NgClass],
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.scss',
})
export class RankingComponent implements OnInit {
  public competitionId = input<string>();
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
    this.ranking$ = this.timeService.getActualDate().pipe(
      switchMap(() => {
        return this.battleInstanceQueriesService.getRanking(
          this.competitionId()
        );
      })
    );
    this.playerService.player$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((player) => {
        if (player) {
          this.playerId = player._id;
        }
      });
  }
}