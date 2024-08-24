import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CompetitionHistoryModel } from '../../models/competition-history.model';
import { TimeService } from '../../services/time.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CompetitionHistoryQueriesService } from '../../services/queries/competition-history-queries.service';
import { filter, startWith, switchMap } from 'rxjs';
import { RankingComponent } from '../../components/ranking/ranking.component';
import { TournamentRankingComponent } from '../../components/ranking/tournament-ranking/tournament-ranking.component';
import { TranslateModule } from '@ngx-translate/core';
import { CacheService } from '../../services/cache.service';
import { GroupsRankingComponent } from '../../components/ranking/groups-ranking/groups-ranking.component';

@Component({
  selector: 'pm-competition-history',
  standalone: true,
  imports: [
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    RankingComponent,
    TournamentRankingComponent,
    TranslateModule,
    GroupsRankingComponent,
  ],
  templateUrl: './competition-history.component.html',
  styleUrl: './competition-history.component.scss',
})
export class CompetitionHistoryComponent implements OnInit {
  private timeService = inject(TimeService);
  private destroyRef = inject(DestroyRef);
  private competitionHistoryQueriesService = inject(
    CompetitionHistoryQueriesService
  );

  private cacheService = inject(CacheService);

  protected competitionHistoryForm = new FormGroup({
    year: new FormControl<number>(null, [
      Validators.required,
      Validators.min(2023),
    ]),
    competition: new FormControl<CompetitionHistoryModel>(null),
  });

  protected competitionHistory: CompetitionHistoryModel[];

  public ngOnInit(): void {
    this.timeService
      .getActualDate()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((value) => !!value),
        switchMap((date) => {
          this.competitionHistoryForm.controls.year.setValue(
            date.getFullYear() - 1
          );
          return this.competitionHistoryForm.controls.year.valueChanges.pipe(
            startWith(this.competitionHistoryForm.controls.year.value)
          );
        }),
        switchMap((value) => {
          this.competitionHistoryForm.controls.competition.setValue(undefined);
          return this.competitionHistoryQueriesService.list({
            custom: { season: value, gameId: this.cacheService.getGameId() },
          });
        })
      )
      .subscribe((competition) => {
        this.competitionHistory = competition;
      });
  }

  protected add(value: number): void {
    const newValue = this.competitionHistoryForm.controls.year.value + value;
    this.competitionHistoryForm.controls.year.setValue(
      Math.max(newValue, 2023)
    );
  }
}
