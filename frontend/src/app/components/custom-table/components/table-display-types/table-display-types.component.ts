import { Component } from '@angular/core';
import { DynamicCellBaseDirective } from '../../dynamic-cell-base.directive';

import { DisplayTypeComponent } from '../../../display-type/display-type.component';

@Component({
  selector: 'pm-table-display-types',
  standalone: true,
  imports: [DisplayTypeComponent],
  templateUrl: './table-display-types.component.html',
  styleUrls: ['./table-display-types.component.scss'],
})
export class TableDisplayTypesComponent extends DynamicCellBaseDirective<
  string[]
> {}
