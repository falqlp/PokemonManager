import { Component, input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'pm-battle-daily-form',
  standalone: true,
  imports: [MatTooltipModule, TranslateModule],
  templateUrl: './battle-daily-form.component.html',
  styleUrl: './battle-daily-form.component.scss',
})
export class BattleDailyFormComponent {
  public dailyForm = input<number>(0);
}
