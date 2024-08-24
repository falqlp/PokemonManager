import { Component, DestroyRef, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { AsyncPipe } from '@angular/common';
import { TrainerModel } from '../../models/TrainersModels/trainer.model';
import { TrainerQueriesService } from '../../services/queries/trainer-queries.service';
import { CustomValidatorService } from '../../services/custom-validator.service';
import { MatButtonModule } from '@angular/material/button';
import { CalendarEventQueriesService } from '../../services/queries/calendar-event-queries.service';
import { Observable, tap } from 'rxjs';
import { TimeService } from '../../services/time.service';
import { CompetitionModel } from '../../models/competition.model';
import { CompetitionQueriesService } from '../../services/queries/competition-queries.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TrainerNameComponent } from '../../components/trainer-name/trainer-name.component';

@Component({
  selector: 'pm-add-calendar-event',
  standalone: true,
  imports: [
    MatDialogModule,
    TranslateModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
    AsyncPipe,
    TrainerNameComponent,
  ],
  templateUrl: './add-calendar-event.component.html',
  styleUrls: ['./add-calendar-event.component.scss'],
})
export class AddCalendarEventComponent implements OnInit {
  protected trainers: TrainerModel[];
  protected competitions: CompetitionModel[];
  protected calendarEventForm = new FormGroup({
    date: new FormControl<Date>(null, Validators.required),
    trainers: new FormControl<TrainerModel[]>(null, [
      this.customValidatorService.arrayExactLength(2),
    ]),
    competition: new FormControl<CompetitionModel>(null, Validators.required),
  });

  protected currentDate$: Observable<Date>;
  protected maxDate: Date;

  public constructor(
    protected trainerQueriesService: TrainerQueriesService,
    protected customValidatorService: CustomValidatorService,
    protected timeService: TimeService,
    protected dialogRef: MatDialogRef<AddCalendarEventComponent>,
    protected calendarEventQueriesService: CalendarEventQueriesService,
    protected competitionQueriesService: CompetitionQueriesService,
    protected destroyRef: DestroyRef
  ) {}

  public ngOnInit(): void {
    this.trainerQueriesService
      .list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((trainers) => {
        this.trainers = trainers;
      });
    this.currentDate$ = this.timeService.getActualDate().pipe(
      tap((actualDate) => {
        const currentYear = actualDate.getFullYear();
        this.maxDate = new Date(currentYear, 11, 31);
      })
    );
    this.competitionQueriesService
      .list()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((competitions) => {
        this.competitions = competitions;
      });
  }

  protected submit(): void {
    this.calendarEventQueriesService
      .createBattleEvent(
        this.calendarEventForm.controls.date.value,
        this.calendarEventForm.controls.trainers.value,
        this.calendarEventForm.controls.competition.value
      )
      .subscribe(() => {
        this.dialogRef.close();
      });
  }

  protected cancel(): void {
    this.dialogRef.close();
  }
}
