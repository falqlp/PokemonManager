import { Component, OnInit, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'pm-init-game',
  standalone: true,
  imports: [MatDialogModule, MatProgressSpinnerModule, TranslateModule],
  templateUrl: './init-game.component.html',
  styleUrl: './init-game.component.scss',
})
export class InitGameComponent implements OnInit {
  protected dialog = inject(MatDialog);

  protected loading = '';
  public key = '';

  public ngOnInit(): void {
    this.startLoadingAnimation();
  }

  private startLoadingAnimation(): void {
    let counter = 0;
    setInterval(() => {
      switch (counter % 4) {
        case 0:
          this.loading = '.';
          break;
        case 1:
          this.loading = '..';
          break;
        case 2:
          this.loading = '...';
          break;
        case 3:
          this.loading = '';
          break;
      }
      counter += 1;
    }, 1000);
  }
}
