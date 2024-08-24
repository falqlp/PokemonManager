import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { UserQueriesService } from '../../../services/queries/user-queries.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NotificationType,
  NotifierService,
} from '../../../services/notifier.service';
import { RouterService } from '../../../services/router.service';

@Component({
  selector: 'pm-verify-email',
  standalone: true,
  imports: [],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss',
})
export class VerifyEmailComponent implements OnInit {
  protected userQueriesService = inject(UserQueriesService);
  protected destroyRef = inject(DestroyRef);
  protected notifierService = inject(NotifierService);
  protected routerService = inject(RouterService);

  @Input('id') public id: string;

  public ngOnInit(): void {
    this.userQueriesService
      .verify(this.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.notifierService.notify({
          key: 'EMAIL_SUCCESSFULLY_VERIFIED',
          type: NotificationType.Success,
        });
        this.routerService.navigateByUrl('login');
      });
  }
}
