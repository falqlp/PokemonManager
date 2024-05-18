import { Component, DestroyRef, input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserModel } from '../../../../models/user.model';
import { debounceTime, Observable, switchMap } from 'rxjs';
import { UserQueriesService } from '../../../../services/queries/user-queries.service';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NotificationType,
  NotifierService,
} from '../../../../services/notifier.service';

@Component({
  selector: 'pm-find-friend',
  standalone: true,
  imports: [
    MatInputModule,
    TranslateModule,
    MatAutocompleteModule,
    AsyncPipe,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './find-friend.component.html',
  styleUrl: './find-friend.component.scss',
})
export class FindFriendComponent implements OnInit {
  protected autoCompeteForm = new FormControl<UserModel | string>(
    null,
    Validators.required
  );

  protected $users: Observable<UserModel[]>;
  public user = input<UserModel>();

  constructor(
    private userQueriesService: UserQueriesService,
    private destroyRef: DestroyRef,
    private notifierService: NotifierService
  ) {}

  public ngOnInit(): void {
    this.$users = this.autoCompeteForm.valueChanges.pipe(
      debounceTime(150),
      switchMap((value) => {
        return this.userQueriesService.list({
          custom: {
            username: { $regex: value, $options: 'i' },
            _id: { $ne: this.user()._id },
            friends: {
              $not: { $in: [this.user()._id] },
            },
            friendRequest: {
              $not: {
                $in: [this.user()._id],
              },
            },
          },
          limit: 10,
        });
      })
    );
  }

  protected display(user: UserModel): string {
    return user && user.username ? user.username : '';
  }

  protected sendInvitation(): void {
    if (
      typeof this.autoCompeteForm.value !== 'string' &&
      this.autoCompeteForm.value
    ) {
      this.userQueriesService
        .addFriend(this.autoCompeteForm.value._id, this.user()._id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.autoCompeteForm.setValue('');
          this.notifierService.notify({
            type: NotificationType.Neutral,
            key: 'INVITATION_SENT',
          });
        });
    }
  }

  protected isUser(user: UserModel | string): boolean {
    return typeof user !== 'string';
  }
}
