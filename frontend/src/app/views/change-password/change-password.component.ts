import { Component, DestroyRef, Input, OnInit } from '@angular/core';
import { PasswordRequestQueriesService } from '../../services/queries/password-request-queries.service';
import { UserQueriesService } from '../../services/queries/user-queries.service';
import { PasswordRequestModel } from '../../models/password-request.model';
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
import { UserModel } from '../../models/user.model';
import {
  NotificationType,
  NotifierService,
} from '../../services/notifier.service';
import { RouterService } from '../../services/router.service';

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
export class ChangePasswordComponent implements OnInit {
  @Input('id') public id: string;
  protected passwordRequest: PasswordRequestModel;
  protected changePasswordForm = new FormGroup(
    {
      password: new FormControl<string>('', Validators.required),
      verifyPassword: new FormControl<string>('', Validators.required),
    },
    { validators: this.customValidatorService.checkPasswordsValidator() }
  );

  constructor(
    protected passwordRequestQueriesService: PasswordRequestQueriesService,
    protected userQueriesService: UserQueriesService,
    protected destroyRef: DestroyRef,
    protected customValidatorService: CustomValidatorService,
    protected notifierService: NotifierService,
    protected routerService: RouterService
  ) {}

  public ngOnInit(): void {
    this.passwordRequestQueriesService
      .getPasswordRequest(this.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((passwordRequest) => {
        this.passwordRequest = passwordRequest;
      });
  }

  public submit(): void {
    if (new Date(this.passwordRequest.expirationDate).getTime() > Date.now()) {
      this.userQueriesService
        .update(
          {
            password: this.changePasswordForm.controls.password.value,
          } as UserModel,
          this.passwordRequest.user._id
        )
        .subscribe(() => {
          this.notifierService.notify({
            key: 'PASSWORD_SUCCESSFULLY_MODIFIED',
            type: NotificationType.Success,
          });
          this.routerService.navigateByUrl('login');
        });
    } else {
      this.notifierService.notify({ key: 'LINK_EXPIRED' });
    }
  }
}
