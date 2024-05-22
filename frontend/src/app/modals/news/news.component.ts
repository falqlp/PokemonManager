import { Component, DestroyRef, OnInit } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../services/user.service';
import { UserQueriesService } from '../../services/queries/user-queries.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { first, switchMap } from 'rxjs';

@Component({
  selector: 'pm-news',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, TranslateModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
})
export class NewsComponent implements OnInit {
  constructor(
    private userService: UserService,
    private destroyRef: DestroyRef,
    private userQueriesService: UserQueriesService
  ) {}

  public ngOnInit(): void {
    this.userService.$user
      .pipe(
        first(),
        takeUntilDestroyed(this.destroyRef),
        switchMap((player) => {
          player.hasReadNews = true;
          return this.userQueriesService.update(player, player._id);
        })
      )
      .subscribe();
  }
}
