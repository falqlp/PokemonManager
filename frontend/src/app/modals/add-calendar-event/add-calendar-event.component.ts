import { Component, OnInit } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
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
import { NgForOf } from '@angular/common';
import { TrainerModel } from '../../models/TrainersModels/trainer.model';
import { TrainerQueriesService } from '../../services/queries/trainer-queries.service';
import { CustomValidatorService } from '../../services/custom-validator.service';
import { MatButtonModule } from '@angular/material/button';
import { CalendarEventQueriesService } from '../../services/queries/calendar-event-queries.service';

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
    NgForOf,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './add-calendar-event.component.html',
  styleUrls: ['./add-calendar-event.component.scss'],
})
export class AddCalendarEventComponent implements OnInit {
  protected trainers: TrainerModel[];
  protected calendarEventForm = new FormGroup({
    date: new FormControl<Date>(null, Validators.required),
    trainers: new FormControl<TrainerModel[]>(null, [
      this.customValidatorService.arrayExactLength(2),
    ]),
  });

  public constructor(
    protected trainerQueriesService: TrainerQueriesService,
    protected customValidatorService: CustomValidatorService,
    protected calendarEventQueriesService: CalendarEventQueriesService
  ) {}

  public ngOnInit(): void {
    this.trainerQueriesService.list().subscribe((trainers) => {
      this.trainers = trainers;
    });
  }

  protected submit(): void {
    this.calendarEventQueriesService
      .createBattleEvent(
        this.calendarEventForm.controls.date.value,
        this.calendarEventForm.controls.trainers.value
      )
      .subscribe(console.log);
  }
}
