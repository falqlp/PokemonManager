import { inject, Pipe, PipeTransform } from '@angular/core';
import { SessionStorageService } from '../services/session-storage.service';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'ranking',
  standalone: true,
})
export class RankingPipe implements PipeTransform {
  private readonly sessionStorageService = inject(SessionStorageService);
  private readonly translateService = inject(TranslateService);

  public transform(value: {
    trainerId: string;
    competitionId: string;
  }): string {
    const ranking = this.sessionStorageService.getTrainerRanking(
      value.competitionId,
      value.trainerId
    );
    return `${ranking}${this.getRankingSuffix(ranking)}`;
  }

  private getRankingSuffix(ranking: number): string {
    switch (ranking) {
      case 1:
        return this.translateService.instant('FIRST_SUFFIX');
      case 2:
        return this.translateService.instant('SECOND_SUFFIX');
      case 3:
        return this.translateService.instant('THIRD_SUFFIX');
      default:
        return this.translateService.instant('RANKING_SUFFIX');
    }
  }
}
