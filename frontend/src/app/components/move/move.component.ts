import { Component, Input } from '@angular/core';

import { MoveModel } from '../../models/move.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'pm-move',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './move.component.html',
  styleUrls: ['./move.component.scss'],
})
export class MoveComponent {
  @Input() public move: MoveModel;
}
