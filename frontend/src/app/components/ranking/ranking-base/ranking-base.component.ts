import { Component, input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { NgClass } from '@angular/common';
import { Observable } from 'rxjs';
import { RankingModel } from '../../../models/ranking.model';

@Component({
  selector: 'pm-ranking-base',
  standalone: true,
  imports: [MatTableModule, TranslateModule, NgClass],
  templateUrl: './ranking-base.component.html',
  styleUrl: './ranking-base.component.scss',
})
export class RankingBaseComponent {
  public ranking$ = input<Observable<RankingModel[]>>();
  public maxGood = input<number>(0);
  public minBad = input<number>(100);

  protected displayedColumns: string[] = [
    'ranking',
    'class',
    'name',
    'wins',
    'losses',
    'winPercentage',
  ];

  public playerId = input<string>();
}
