import { Component, DestroyRef, Input, OnInit } from '@angular/core';
import { UserQueriesService } from '../../services/queries/user-queries.service';
import { UserModel } from '../../models/user.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NotificationType,
  NotifierService,
} from '../../services/notifier.service';
import { RouterService } from '../../services/router.service';

@Component({
  selector: 'pm-verify-email',
  standalone: true,
  imports: [],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss',
})
export class VerifyEmailComponent implements OnInit {
  @Input('id') public id: string;
  constructor(
    protected userQueriesService: UserQueriesService,
    protected destroyRef: DestroyRef,
    protected notifierService: NotifierService,
    protected routerService: RouterService
  ) {}

  public ngOnInit(): void {
    this.userQueriesService
      .update({ verified: true, _id: this.id } as UserModel, this.id)
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
