import { Component, DestroyRef, OnInit, inject } from '@angular/core';
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
