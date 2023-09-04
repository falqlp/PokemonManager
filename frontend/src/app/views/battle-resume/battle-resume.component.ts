import { Component, DestroyRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BattleModel } from '../../models/Battle.model';
import { BattleInstanceQueriesService } from '../../services/queries/battle-instance-queries.service';
import { switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-battle-resume',
  templateUrl: './battle-resume.component.html',
  styleUrls: ['./battle-resume.component.scss'],
})
export class BattleResumeComponent implements OnInit {
  protected battle: BattleModel;

  public constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected battleQueries: BattleInstanceQueriesService,
    protected destroyRef: DestroyRef
  ) {}

  public ngOnInit(): void {
    this.route.queryParams
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((params) => {
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
