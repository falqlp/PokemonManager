import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { TableDisplayTextComponent } from './components/table-display-text/table-display-text.component';
import { NgForOf, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicCellDirective } from './dynamic-cell.directive';
import { QueryModel } from '../../core/query.model';

export interface CellModel {
  component: string;
  data: string | 'all';
}
export interface TableConfModel {
  columns: {
    name: string;
    sort?: boolean;
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
    NgIf,
  ],
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss'],
})
export class CustomTableComponent<T> implements OnInit {
  @Input() public $data: Observable<T[]>;
  @Input() public query: (query?: QueryModel) => Observable<T[]>;
  @Input() public conf: TableConfModel;
  protected sortQuerySubject: BehaviorSubject<Record<string, number>> =
    new BehaviorSubject({});

  public ngOnInit(): void {
    this.$data = this.sortQuerySubject.pipe(
      switchMap((sortQuery) => {
        return this.query({ sort: sortQuery });
      })
    );
  }

  protected mapColumnName(): string[] {
    return this.conf.columns.map((col) => col.name);
  }

  protected sort(event: Sort): void {
    this.sortQuerySubject.next(this.createSortQuery(event));
  }

  protected createSortQuery(sort: Sort): Record<string, number> {
    const sortQuery: Record<string, number> = {};
    let direction;
    switch (sort.direction) {
      case 'asc':
        direction = 1;
        break;
      case 'desc':
        direction = -1;
        break;
      default:
        direction = 0;
        break;
    }
    sortQuery[sort.active] = direction;
    return sortQuery;
  }
}
