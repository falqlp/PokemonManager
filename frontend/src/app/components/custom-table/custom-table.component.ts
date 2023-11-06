import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { BehaviorSubject, startWith, switchMap } from 'rxjs';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TableDisplayTextComponent } from './components/table-display-text/table-display-text.component';
import { NgForOf, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicCellDirective } from './dynamic-cell.directive';
import { QueryModel } from '../../core/query.model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ReadonlyQuery } from '../../core/readonly-query';
import { MatInputModule } from '@angular/material/input';

export interface CellModel {
  component: string;
  data: string | 'all';
}
export interface TableConfModel {
  columns: {
    name: string;
    sort?: boolean | string;
    search?: string;
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
    MatPaginatorModule,
    MatInputModule,
  ],
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss'],
})
export class CustomTableComponent<T> implements AfterViewInit {
  @Input() public queryService: ReadonlyQuery<T>;
  @Input() public conf: TableConfModel;
  protected sortQuerySubject: BehaviorSubject<Record<string, number>> =
    new BehaviorSubject({});

  protected dataSource = new MatTableDataSource<T>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  public ngAfterViewInit(): void {
    this.queryService
      .count()
      .pipe(
        switchMap((count) => {
          this.paginator.length = count;
          return this.paginator.page.pipe(startWith({}));
        }),
        switchMap(() => {
          return this.sortQuerySubject;
        }),
        switchMap((sortQuery) => {
          const queryModel: QueryModel = {
            skip: this.paginator.pageIndex * this.paginator.pageSize,
            limit: this.paginator.pageSize,
            sort: sortQuery,
          };
          return this.queryService.translateAggregation(queryModel);
        })
      )
      .subscribe((data) => {
        this.dataSource.data = data;
      });
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
    const customSort = this.conf.columns.find(
      (column) => column.name === sort.active
    ).sort;
    if (typeof customSort === 'string') {
      sortQuery[customSort] = direction;
    } else {
      sortQuery[sort.active] = direction;
    }
    return sortQuery;
  }

  protected getData(element: T, data: string): any {
    if (data === 'all') {
      return element;
    }
    const parts = data.split('.');
    return this.getElementPart(element as Record<string, never>, parts);
  }

  protected getElementPart(element: Record<string, any>, parts: string[]): any {
    return parts.reduce((acc, part) => {
      if (acc && acc[part] !== undefined) {
        return acc[part];
      } else {
        return undefined;
      }
    }, element);
  }
}
