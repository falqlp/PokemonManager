import { Component, DestroyRef, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { FindFriendComponent } from './find-friend/find-friend.component';
import { CacheService } from '../../../services/cache.service';
import { UserQueriesService } from '../../../services/queries/user-queries.service';
import { switchMap } from 'rxjs';
import { UserModel } from '../../../models/user.model';
import { FriendsListComponent } from './friends-list/friends-list.component';
import { FriendsRequestComponent } from './friends-request/friends-request.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  protected user: UserModel;
  constructor(
    private cacheService: CacheService,
    private userQueriesService: UserQueriesService,
    private destroyRef: DestroyRef
  ) {}

  public ngOnInit(): void {
    this.cacheService.$userId
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((id) => {
          return this.userQueriesService.get(id);
        })
      )
      .subscribe((user: UserModel) => {
        this.user = user;
      });
  }
}
