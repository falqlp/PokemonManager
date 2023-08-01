import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BattleModel } from '../../models/Battle.model';
import { BattleQueriesService } from '../../services/battle-queries.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-battle-resume',
  templateUrl: './battle-resume.component.html',
  styleUrls: ['./battle-resume.component.scss'],
})
export class BattleResumeComponent implements OnInit {
  protected winner: string;
  protected battle: BattleModel;

  public constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected battleQueries: BattleQueriesService
  ) {}

  public ngOnInit(): void {
    this.route.queryParams
      .pipe(
        switchMap((params) => {
          this.winner = params['winner'];
          return this.battleQueries.get(params['battle']);
        })
      )
      .subscribe((battle) => {
        this.battle = battle;
      });
  }

  protected backHome(): void {
    this.router.navigate(['home']);
  }
}
