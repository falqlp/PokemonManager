import { Component, OnInit } from '@angular/core';
import { UserQueriesService } from '../../services/queries/user-queries.service';
import { UserModel } from '../../models/user.model';
import { NgIf } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { MatSortModule } from '@angular/material/sort';
import { TranslateModule } from '@ngx-translate/core';
import { LocalDatePipe } from '../../pipes/local-date.pipe';
import { GameModel } from '../../models/party.model';

@Component({
  selector: 'pm-games',
  standalone: true,
  imports: [
    NgIf,
    MatTableModule,
    MatSortModule,
    TranslateModule,
    LocalDatePipe,
  ],
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
})
export class GamesComponent implements OnInit {
  protected user: UserModel;
  protected gameSubject = new BehaviorSubject<GameModel[]>(undefined);
  protected $game = this.gameSubject.asObservable();
  protected displayedColumns = ['name', 'actualDate', 'player'];
  constructor(protected userQueriesService: UserQueriesService) {}

  public ngOnInit(): void {
    this.userQueriesService
      .get(localStorage.getItem('userId'))
      .subscribe((user) => {
        this.user = user;
        this.gameSubject.next(user.games);
      });
  }
}
