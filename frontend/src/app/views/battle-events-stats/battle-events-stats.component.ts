import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CompetitionModel } from '../../models/competition.model';
import { TrainerModel } from '../../models/TrainersModels/trainer.model';
import { PlayerService } from '../../services/player.service';
import { filter, map, Observable, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  BattleEventQueryType,
  DamageEventQueryModel,
  PeriodModel,
} from '../../models/battle-events.model';
import { BattleEventsStatsGraphComponent } from './battle-events-stats-graph/battle-events-stats-graph.component';
import {
  MatFormField,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { CompetitionQueriesService } from '../../services/queries/competition-queries.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TrainerQueriesService } from '../../services/queries/trainer-queries.service';
import { AsyncPipe, NgForOf } from '@angular/common';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { MatInput } from '@angular/material/input';
import {
  MatButtonToggle,
  MatButtonToggleGroup,
} from '@angular/material/button-toggle';
import { TimeService } from '../../services/time.service';
import { addDays, addMonth } from '../../core/DateUtils';
import {
  MatDatepickerInputEvent,
  MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker,
  MatEndDate,
  MatStartDate,
} from '@angular/material/datepicker';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'pm-battle-events-stats',
  standalone: true,
  imports: [
    BattleEventsStatsGraphComponent,
    MatFormField,
    MatSelect,
    ReactiveFormsModule,
    MatOption,
    TranslateModule,
    MatIconButton,
    MatSuffix,
    MatIcon,
    AsyncPipe,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatInput,
    MatLabel,
    NgForOf,
    MatButtonToggleGroup,
    MatButtonToggle,
    MatDateRangeInput,
    MatDateRangePicker,
    MatDatepickerToggle,
    MatEndDate,
    MatStartDate,
    MatSlideToggle,
    MatButton,
    MatTooltip,
  ],
  templateUrl: './battle-events-stats.component.html',
  styleUrl: './battle-events-stats.component.scss',
})
export class BattleEventsStatsComponent implements OnInit {
  private readonly playerService: PlayerService = inject(PlayerService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly competitionQueriesService: CompetitionQueriesService =
    inject(CompetitionQueriesService);

  private readonly trainerQueriesService: TrainerQueriesService = inject(
    TrainerQueriesService
  );

  private readonly translateService: TranslateService =
    inject(TranslateService);

  private readonly timeService: TimeService = inject(TimeService);
  protected readonly indicators = Object.values(BattleEventQueryType);

  protected readonly divisions = [3];
  protected competitions = signal<CompetitionModel[]>([]);
  protected trainers = signal<TrainerModel[]>([]);
  protected periods = signal<PeriodModel[]>([]);
  protected isCustomPeriod = signal<boolean>(false);
  protected actualDate: Date;
  protected query: Observable<DamageEventQueryModel>;
  protected queryForm = new FormGroup({
    context: new FormGroup({
      division: new FormControl<number>(null),
      competition: new FormControl<CompetitionModel>(null),
      trainers: new FormControl<TrainerModel[]>([]),
      period: new FormControl<PeriodModel>(null),
    }),
    indicator: new FormGroup({
      indicator: new FormControl<BattleEventQueryType>(
        BattleEventQueryType.TOTAL_DAMAGE
      ),
      isRelative: new FormControl<boolean>(true),
    }),
  });

  public ngOnInit(): void {
    this.queryForm.controls.context.valueChanges.subscribe(console.info);
    this.timeService.getActualDate().subscribe((date) => {
      this.actualDate = date;
      const periods: PeriodModel[] = [];
      periods.push({ endDate: date, startDate: addDays(new Date(date), -7) });
      periods.push({ endDate: date, startDate: addMonth(new Date(date), -1) });
      periods.push({ endDate: date, startDate: addMonth(new Date(date), -3) });
      periods.push({ endDate: date, startDate: addMonth(new Date(date), -6) });
      this.periods.set(periods);
    });
    this.playerService.player$
      .pipe(
        filter((player) => !!player),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((player) => {
        this.queryForm.controls.context.controls.division.setValue(
          player.competitions[player.competitions.length - 1].division
        );
      });
    this.trainerQueriesService.list().subscribe((result) => {
      this.trainers.set(result);
    });
    this.queryForm.controls.context.controls.division.valueChanges
      .pipe(
        switchMap((value) => {
          return this.competitionQueriesService.list({
            custom: { division: value },
          });
        }),
        switchMap((competitions) => {
          this.competitions.set(competitions);
          return this.queryForm.controls.context.controls.competition
            .valueChanges;
        }),
        switchMap((competition) => {
          if (competition) {
            return this.trainerQueriesService.list({
              custom: { competitions: competition._id },
            });
          }
          return this.trainerQueriesService.list();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((trainers) => this.trainers.set(trainers));
    this.query = this.queryForm.controls.context.valueChanges.pipe(
      map((value) => {
        return {
          period: value.period,
          trainerIds: value.trainers.map((trainer) => trainer._id),
          competitionId: value.competition?._id,
        };
      })
    );
  }

  protected clearControl(
    event: Event,
    control: FormControl,
    setCustomFalse?: boolean
  ): void {
    event.stopPropagation();
    if (Array.isArray(control.value)) {
      control.setValue([]);
    } else {
      control.setValue(null);
    }
    if (setCustomFalse) {
      this.isCustomPeriod.set(false);
    }
  }

  protected customPeriodChange(custom: boolean): void {
    this.isCustomPeriod.set(custom);
  }

  protected onDateRangeChange(
    event: MatDatepickerInputEvent<Date>,
    isEndDate: boolean
  ): void {
    let period = this.queryForm.controls.context.controls.period.value;
    if (isEndDate) {
      period = { ...period, endDate: event.value };
    } else {
      period = { ...period, startDate: event.value };
    }
    this.queryForm.controls.context.controls.period.setValue(period);
  }

  protected formatIndicator(key: BattleEventQueryType): string {
    return this.translateService.instant(key);
  }

  protected clearAll(): void {
    this.queryForm.controls.context.setValue({
      period: null,
      trainers: [],
      competition: null,
      division: null,
    });
  }
}
