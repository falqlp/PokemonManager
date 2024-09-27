import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../services/user.service';
import { UserQueriesService } from '../../services/queries/user-queries.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { first, switchMap } from 'rxjs';
import { NewsV11Component } from '../../components/news/news-v1-1/news-v1-1.component';

@Component({
  selector: 'pm-news-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    TranslateModule,
    NewsV11Component,
  ],
  templateUrl: './news-dialog.component.html',
  styleUrl: './news-dialog.component.scss',
})
export class NewsDialogComponent implements OnInit {
  private userService = inject(UserService);
  private destroyRef = inject(DestroyRef);
  private userQueriesService = inject(UserQueriesService);

  public ngOnInit(): void {
    this.userService.$user
      .pipe(
        first(),
        switchMap((player) => {
          player.hasReadNews = true;
          return this.userQueriesService.readNews(player._id);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
