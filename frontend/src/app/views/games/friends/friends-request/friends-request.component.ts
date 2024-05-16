import { Component, DestroyRef, Input } from '@angular/core';
import { UserModel } from '../../../../models/user.model';
import { AsyncPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { UserQueriesService } from '../../../../services/queries/user-queries.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'pm-friends-request',
  standalone: true,
  imports: [AsyncPipe, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './friends-request.component.html',
  styleUrl: './friends-request.component.scss',
})
export class FriendsRequestComponent {
  @Input() public user: UserModel;
  constructor(
    private userQueriesService: UserQueriesService,
    private destroyRef: DestroyRef
  ) {}

  protected add(user: UserModel): void {
    this.user.friendRequest = this.user.friendRequest.filter(
      (friend) => friend._id !== user._id
    );
    this.user.friends.push(user);
    user.friends.push(this.user._id as unknown as UserModel);
    this.userQueriesService
      .update(this.user, this.user._id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
    this.userQueriesService
      .update(user, user._id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  protected delete(user: UserModel): void {
    this.user.friendRequest = this.user.friendRequest.filter(
      (friend) => friend._id !== user._id
    );
    this.userQueriesService
      .update(this.user, this.user._id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
