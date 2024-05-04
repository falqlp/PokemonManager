import { Component, DestroyRef } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CustomValidatorService } from '../../services/custom-validator.service';
import { MatButtonModule } from '@angular/material/button';
import { PasswordRequestQueriesService } from '../../services/queries/password-request-queries.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotifierService } from '../../services/notifier.service';

@Component({
  selector: 'pm-forgotten-password',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    TranslateModule,
    MatButtonModule,
  ],
  templateUrl: './forgotten-password.component.html',
  styleUrl: './forgotten-password.component.scss',
})
export class ForgottenPasswordComponent {
  protected form = new FormGroup({
    email: new FormControl<string>('', [
      Validators.required,
      this.customValidatorService.emailValidator(),
    ]),
    username: new FormControl<string>('', Validators.required),
  });

  constructor(
    protected customValidatorService: CustomValidatorService,
    protected dialogRef: MatDialogRef<ForgottenPasswordComponent>,
    protected passwordRequestQueriesService: PasswordRequestQueriesService,
    protected destroyRef: DestroyRef,
    protected translateService: TranslateService,
    protected notifierService: NotifierService
  ) {}

  protected submit(): void {
    this.passwordRequestQueriesService
      .createPasswordRequest(
        this.form.controls.email.value,
        this.form.controls.username.value
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.dialogRef.close();
        this.notifierService.notify(
          this.translateService.instant('MAIL_SENT_TO', {
            email: this.form.controls.email.value,
          })
        );
      });
  }
}
