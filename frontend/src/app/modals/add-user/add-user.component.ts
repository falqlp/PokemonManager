import { Component, DestroyRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserQueriesService } from '../../services/queries/user-queries.service';
import { AddUserForm } from './add-user-form.model';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { CustomValidatorService } from '../../services/custom-validator.service';
import { NgIf } from '@angular/common';
import {
  NotificationType,
  NotifierService,
} from '../../services/notifier.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError } from 'rxjs/operators';
import { debounceTime, map, Observable, of } from 'rxjs';
import { GenericDialogComponent } from '../generic-dialog/generic-dialog.component';
import { DialogButtonsModel } from '../generic-dialog/generic-dialog.models';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Languages } from '../../models/user.model';

@Component({
  selector: 'pm-add-user',
  standalone: true,
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    TranslateModule,
    MatDialogModule,
    NgIf,
    MatCheckboxModule,
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
})
export class AddUserComponent {
  protected addUserForm = new FormGroup<AddUserForm>(
    {
      username: new FormControl<string>('', {
        validators: Validators.required,
        asyncValidators: this.usernameAlreadyUsed(),
      }),
      email: new FormControl<string>('', {
        validators: [
          Validators.required,
          this.customValidatorService.emailValidator(),
        ],
        asyncValidators: this.emailAlreadyUsed(),
      }),
      password: new FormControl<string>('', Validators.required),
      verifyPassword: new FormControl<string>('', Validators.required),
      subscribeToNewsletter: new FormControl<boolean>(false),
    },
    { validators: this.customValidatorService.checkPasswordsValidator() }
  );

  constructor(
    protected userQueriesService: UserQueriesService,
    protected customValidatorService: CustomValidatorService,
    protected notifierService: NotifierService,
    protected translateService: TranslateService,
    protected dialogRef: MatDialogRef<AddUserComponent>,
    protected destroyRef: DestroyRef,
    protected dialog: MatDialog
  ) {}

  protected addUser(): void {
    const addUser = this.addUserForm.getRawValue();
    this.userQueriesService
      .create({
        username: addUser.username,
        password: addUser.password,
        email: addUser.email,
        verified: false,
        subscribeToNewsletter: addUser.subscribeToNewsletter,
        lang: navigator.language as Languages,
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((err) => {
          this.notifierService.notify(
            err.error.message,
            NotificationType.Error
          );
          return of();
        })
      )
      .subscribe(() => {
        this.notifierService.notify('ACCOUNT_CREATED');
        this.dialogRef.close();
        const buttons: DialogButtonsModel[] = [
          {
            close: true,
            label: 'Ok',
            color: 'accent',
          },
        ];
        this.dialog.open(GenericDialogComponent, {
          data: {
            buttons,
            message: 'VERIFICATION_MAIL_SENT',
          },
        });
      });
  }

  protected emailAlreadyUsed(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.userQueriesService.isEmailUsed(control.value).pipe(
        debounceTime(150),
        map((response) => {
          return response ? { emailTaken: true } : null;
        }),
        catchError(() => of(null))
      );
    };
  }

  protected usernameAlreadyUsed(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.userQueriesService.isUsernameUsed(control.value).pipe(
        debounceTime(150),
        map((response) => {
          return response ? { usernameTaken: true } : null;
        }),
        catchError(() => of(null))
      );
    };
  }
}
