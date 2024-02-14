import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoveModel } from '../../models/move.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'pm-move',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './move.component.html',
  styleUrls: ['./move.component.scss'],
})
export class MoveComponent {
  @Input() public move: MoveModel;
}
