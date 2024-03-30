import { Component } from '@angular/core';
import { DynamicCellBaseDirective } from '../../dynamic-cell-base.directive';
import { LocalDatePipe } from '../../../../pipes/local-date.pipe';

@Component({
  selector: 'pm-table-display-date',
  standalone: true,
  imports: [LocalDatePipe],
  templateUrl: './table-display-date.component.html',
  styleUrls: ['./table-display-date.component.scss'],
})
export class TableDisplayDateComponent extends DynamicCellBaseDirective<Date> {}
