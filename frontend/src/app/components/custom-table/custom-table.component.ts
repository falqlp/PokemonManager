import { Component, Input, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { TableDisplayTextComponent } from './components/table-display-text/table-display-text.component';
import { NgForOf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicCellDirective } from './dynamic-cell.directive';

export interface CellModel {
  component: string;
  data: string | 'all';
}
export interface ConfModel {
  columns: {
    name: string;
    header: CellModel;
    content: CellModel;
  }[];
}

@Component({
  selector: 'pm-custom-table',
  standalone: true,
  imports: [
    MatSortModule,
    MatTableModule,
    NgForOf,
    TranslateModule,
    TableDisplayTextComponent,
    DynamicCellDirective,
  ],
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss'],
})
export class CustomTableComponent<T> {
  @Input() public $data: Observable<T[]>;
  @Input() public conf: ConfModel;

  protected mapColumnName(): string[] {
    return this.conf.columns.map((col) => col.name);
  }
}
