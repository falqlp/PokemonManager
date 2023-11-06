import { Component } from '@angular/core';
import { DynamicCellBaseDirective } from '../../dynamic-cell-base.directive';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'pm-table-display-text',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './table-display-text.component.html',
  styleUrls: ['./table-display-text.component.scss'],
})
export class TableDisplayTextComponent extends DynamicCellBaseDirective<string> {}
