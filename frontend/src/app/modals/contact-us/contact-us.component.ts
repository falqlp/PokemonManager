import { Component, DestroyRef, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CacheService } from '../../services/cache.service';
import { EmailQueriesService } from '../../services/queries/email-queries.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NotificationType,
  NotifierService,
} from '../../services/notifier.service';

@Component({
  selector: 'pm-contact-us',
  standalone: true,
  imports: [
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    TranslateModule,
    ReactiveFormsModule,
  ],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss',
})
export class ContactUsComponent {
  protected cacheService = inject(CacheService);
  protected emailQueriesService = inject(EmailQueriesService);
  protected destroyRef = inject(DestroyRef);
  protected notifierService = inject(NotifierService);
  protected dialogRef = inject<MatDialogRef<ContactUsComponent>>(MatDialogRef);

  protected contactUsForm = new FormGroup({
    subject: new FormControl<string>('', Validators.required),
    details: new FormControl<string>(''),
  });

  protected send(): void {
    const formValues = this.contactUsForm.getRawValue();
    this.emailQueriesService
      .contactUs(
        formValues.subject,
        formValues.details,
        this.cacheService.getUserId()
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.notifierService.notify({
          key: 'MESSAGE_SUCCESSFULLY_SENT',
          type: NotificationType.Success,
        });
        this.dialogRef.close();
      });
  }
}
