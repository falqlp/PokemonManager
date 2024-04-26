import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserQueriesService } from '../../services/queries/user-queries.service';
import { AddUserForm } from './add-user-form.model';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CustomValidatorService } from '../../services/custom-validator.service';
import { NgIf } from '@angular/common';
import { NotifierService } from '../../services/notifier.service';

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
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
})
export class AddUserComponent {
  protected addUserForm = new FormGroup<AddUserForm>(
    {
      username: new FormControl<string>('', Validators.required),
      password: new FormControl<string>('', Validators.required),
      verifyPassword: new FormControl<string>('', Validators.required),
    },
    { validators: this.customValidatorService.checkPasswordsValidator() }
  );

  constructor(
    protected userQueriesService: UserQueriesService,
    protected customValidatorService: CustomValidatorService,
    protected notifierService: NotifierService,
    protected translateService: TranslateService,
    protected dialogRef: MatDialogRef<AddUserComponent>
  ) {}

  protected addUser(): void {
    const addUser = this.addUserForm.getRawValue();
    this.userQueriesService
      .create({ username: addUser.username, password: addUser.password })
      .subscribe(() => {
        this.notifierService.notify(
          this.translateService.instant('ACCOUNT_CREATED')
        );
        this.dialogRef.close();
      });
  }
}
