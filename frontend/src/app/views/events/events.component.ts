import { Component } from '@angular/core';
import {
  CustomTableComponent,
  TableConfModel,
  TableSearchType,
} from '../../components/custom-table/custom-table.component';
import { CalendarEventQueriesService } from '../../services/queries/calendar-event-queries.service';
import { CalendarEventEvent } from '../../models/calendar-event.model';
import { PlayerService } from '../../services/player.service';
import { map, Observable } from 'rxjs';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'pm-events',
  standalone: true,
  imports: [CustomTableComponent, AsyncPipe, NgIf],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
})
export class EventsComponent {
  public constructor(
    protected calendarEventQueriesService: CalendarEventQueriesService,
    protected playerService: PlayerService
  ) {}

  protected specificQuery: Observable<Record<string, unknown>> =
    this.playerService.player$.pipe(
      map((value) => {
        return {
          'objectid.trainers': value._id,
        };
      })
    );

  protected conf: TableConfModel = {
    columns: [
      {
        name: 'date',
        sort: true,
        search: {
          value: 'date',
          type: TableSearchType.DATE_RANGE,
        },
        header: {
          component: 'displayText',
          data: 'DATE',
        },
        content: {
          component: 'displayDate',
          data: 'date',
        },
      },
      {
        name: 'type',
        search: {
          value: 'type',
          type: TableSearchType.SELECT,
          values: Object.keys(CalendarEventEvent),
        },
        sort: true,
        header: {
          component: 'displayText',
          data: 'EVENTS',
        },
        content: {
          component: 'displayText',
          data: 'type',
        },
      },
    ],
    defaultSort: {
      column: 'date',
      direction: 'desc',
    },
  };
}
