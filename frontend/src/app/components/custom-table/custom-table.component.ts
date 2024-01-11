import {
  AfterViewInit,
  Component,
  DestroyRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, debounceTime, startWith, switchMap } from 'rxjs';
import { MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TableDisplayTextComponent } from './components/table-display-text/table-display-text.component';
import { NgForOf, NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicCellDirective } from './dynamic-cell.directive';
import { QueryModel } from '../../core/query.model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ReadonlyQuery } from '../../core/readonly-query';
import { MatInputModule } from '@angular/material/input';
import { FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export interface CellModel {
  component: string;
  data: string | 'all';
}
export interface TableConfModel {
  defaultSort?: { column: string; direction: SortDirection };
  columns: {
    name: string;
    sort?: boolean | string;
    search?: { value: string; type: string; values?: string[] };
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
    ReactiveFormsModule,
    MatSelectModule,
  ],
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss'],
})
export class CustomTableComponent<T> implements AfterViewInit, OnInit {
  @Input() public queryService: ReadonlyQuery<T>;
  @Input() public conf: TableConfModel;
  protected sortQuerySubject: BehaviorSubject<void> = new BehaviorSubject(null);

  protected dataSource = new MatTableDataSource<T>();
  protected formInput: FormArray<FormControl> = new FormArray([]);
  protected query: QueryModel = { sort: {}, custom: {} };

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(protected destroyRef: DestroyRef) {}

  public ngOnInit(): void {
    this.conf.columns.forEach((column) => {
      if (column.search?.type === 'number') {
        this.formInput.push(new FormControl<number>(null));
      }
      this.formInput.push(new FormControl());
    });
    if (this.conf.defaultSort) {
      this.createSortQuery({
        direction: this.conf.defaultSort.direction,
        active: this.conf.defaultSort.column,
      });
    }
  }

  public ngAfterViewInit(): void {
    this.formInput.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(200),
        startWith([]),
        switchMap((values) => {
          this.getQueryFromInputs(values);
          return this.queryService.count(this.query);
        }),
        switchMap((count) => {
          this.paginator.length = count;
          return this.paginator.page.pipe(startWith({}));
        }),
        switchMap(() => {
          return this.sortQuerySubject;
        }),
        switchMap(() => {
          this.query = {
            ...this.query,
            skip: this.paginator.pageIndex * this.paginator.pageSize,
            limit: this.paginator.pageSize,
          };
          return this.queryService.translateAggregation(this.query);
        })
      )
      .subscribe((data) => {
        this.dataSource.data = data;
      });
  }

  protected mapColumnName(): string[] {
    return this.conf.columns.map((col) => col.name);
  }

  protected mapColumnInput(): string[] {
    return this.conf.columns.map((col) => col.name + 'Input');
  }

  protected sort(event: Sort): void {
    this.createSortQuery(event);
    this.sortQuerySubject.next();
  }

  protected createSortQuery(sort: Sort): void {
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
    this.query.sort = sortQuery;
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

  protected getQueryFromInputs(values: unknown[]): void {
    this.query.custom = {};
    for (let i = 0; i < values.length; i++) {
      if (values[i] && (values[i] as unknown[]).length !== 0) {
        if (this.conf.columns[i].search.type === 'number') {
          this.query.custom[this.conf.columns[i].search.value] = Number(
            values[i]
          );
        } else if (this.conf.columns[i].search.type === 'select') {
          this.query.custom[this.conf.columns[i].search.value] = {
            $all: values[i],
          };
        } else {
          this.query.custom[this.conf.columns[i].search.value] = {
            $regex: values[i],
            $options: 'i',
          };
        }
      }
    }
  }
}
