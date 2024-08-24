import { Component, DestroyRef, Input, inject } from '@angular/core';
import { UserQueriesService } from '../../services/queries/user-queries.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CustomValidatorService } from '../../services/custom-validator.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import {
  NotificationType,
  NotifierService,
} from '../../services/notifier.service';
import { RouterService } from '../../services/router.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'pm-change-password',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent {
  protected userQueriesService = inject(UserQueriesService);
  protected destroyRef = inject(DestroyRef);
  protected customValidatorService = inject(CustomValidatorService);
  protected notifierService = inject(NotifierService);
  protected routerService = inject(RouterService);

  @Input('id') public id: string;
  protected changePasswordForm = new FormGroup(
    {
      password: new FormControl<string>('', Validators.required),
      verifyPassword: new FormControl<string>('', Validators.required),
    },
    { validators: this.customValidatorService.checkPasswordsValidator() }
  );

  public submit(): void {
    this.userQueriesService
      .changePassword(this.changePasswordForm.controls.password.value, this.id)
      .pipe(
        catchError((err) => {
          this.notifierService.notify({ key: 'LINK_EXPIRED' });
          return of(err);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.notifierService.notify({
          key: 'PASSWORD_SUCCESSFULLY_MODIFIED',
          type: NotificationType.Success,
        });
        this.routerService.navigateByUrl('login');
      });
  }
}
