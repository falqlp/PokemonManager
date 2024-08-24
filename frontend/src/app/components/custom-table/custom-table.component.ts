import {
  AfterViewInit,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, debounceTime, startWith, switchMap } from 'rxjs';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { TranslateModule } from '@ngx-translate/core';
import { DynamicCellDirective } from './dynamic-cell.directive';
import { QueryModel } from '../../core/query.model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ReadonlyQuery } from '../../core/readonly-query';
import { MatInputModule } from '@angular/material/input';
import { FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { TableConfModel, TableSearchType } from './custom-table.model';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'pm-custom-table',
  standalone: true,
  imports: [
    MatSortModule,
    MatTableModule,
    TranslateModule,
    DynamicCellDirective,
    MatPaginatorModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatProgressBarModule,
  ],
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.scss'],
})
export class CustomTableComponent<T> implements AfterViewInit, OnInit {
  @Input({ required: true }) public queryService: ReadonlyQuery<T>;
  @Input({ required: true }) public conf: TableConfModel;
  @Input() public specificQuery: Record<string, unknown>;
  @Output() public onRowClick = new EventEmitter<T>();
  protected sortQuerySubject: BehaviorSubject<void> = new BehaviorSubject(null);
  protected loading = false;

  protected dataSource = new MatTableDataSource<T>();
  protected formInput: FormArray<FormControl> = new FormArray([]);
  protected query: QueryModel = { sort: {}, custom: {} };

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(protected destroyRef: DestroyRef) {}

  public ngOnInit(): void {
    this.query.custom = this.specificQuery ?? {};
    this.conf.columns.forEach((column) => {
      if (column.search?.type === TableSearchType.NUMBER) {
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
        debounceTime(150),
        startWith([]),
        switchMap((values) => {
          this.getQueryFromInputs(values);
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
          this.loading = true;
          return this.queryService.queryTable(this.query);
        })
      )
      .subscribe((result) => {
        this.loading = false;
        this.dataSource.data = result.data;
        this.paginator.length = result.count;
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

  protected getData(element: T, data: string): unknown {
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
    this.query.custom = this.specificQuery ?? {};
    for (let i = 0; i < values.length; i++) {
      if (
        values[i] !== null &&
        (!Array.isArray(values[i]) || (values[i] as unknown[]).length !== 0)
      ) {
        switch (this.conf.columns[i].search.type) {
          case TableSearchType.NUMBER:
            this.query.custom[this.conf.columns[i].search.value] = Number(
              values[i]
            );
            break;
          case TableSearchType.MULTI_SELECT:
            this.query.custom[this.conf.columns[i].search.value] = {
              $all: values[i],
            };
            break;
          case TableSearchType.SELECT:
            this.query.custom[this.conf.columns[i].search.value] = values[i];
            break;
          case TableSearchType.DATE_RANGE:
            // eslint-disable-next-line no-case-declarations
            const dateRange = values[i] as Date[];
            if (dateRange[1]) {
              this.query.custom[this.conf.columns[i].search.value] = {
                $gte: dateRange[0],
                $lte: dateRange[1],
              };
            }
            break;
          default:
            if (values[i] !== '') {
              this.query.custom[this.conf.columns[i].search.value] = {
                $regex: values[i],
                $options: 'i',
              };
            }
        }
      }
    }
  }

  protected onDateRangeChange(
    control: FormControl,
    index: number,
    event: MatDatepickerInputEvent<Date>
  ): void {
    const newValue = [
      control.value ? control.value[0] : undefined,
      control.value ? control.value[1] : undefined,
    ];
    newValue[index] = event.value;
    control.setValue(newValue);
  }
}
