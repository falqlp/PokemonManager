import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { FindFriendComponent } from './find-friend/find-friend.component';
import { UserModel } from '../../../../models/user.model';
import { FriendsListComponent } from './friends-list/friends-list.component';
import { FriendsRequestComponent } from './friends-request/friends-request.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'pm-friends',
  standalone: true,
  imports: [
    MatTabsModule,
    TranslateModule,
    FindFriendComponent,
    FriendsListComponent,
    FriendsRequestComponent,
  ],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.scss',
})
export class FriendsComponent implements OnInit {
  private userService = inject(UserService);
  private destroyRef = inject(DestroyRef);

  protected user: UserModel;

  public ngOnInit(): void {
    this.userService.$user
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user: UserModel) => {
        this.user = user;
      });
  }
}
