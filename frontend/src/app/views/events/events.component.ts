import { Component, OnInit, inject } from '@angular/core';
import { CustomTableComponent } from '../../components/custom-table/custom-table.component';
import { CalendarEventQueriesService } from '../../services/queries/calendar-event-queries.service';
import { CalendarEventEvent } from '../../models/calendar-event.model';
import { PlayerService } from '../../services/player.service';
import { map, Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import {
  TableConfModel,
  TableSearchType,
} from '../../components/custom-table/custom-table.model';

@Component({
  selector: 'pm-events',
  standalone: true,
  imports: [CustomTableComponent, AsyncPipe],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss',
})
export class EventsComponent implements OnInit {
  protected calendarEventQueriesService = inject(CalendarEventQueriesService);
  protected playerService = inject(PlayerService);

  protected specificQuery: Observable<Record<string, unknown>>;

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
      {
        name: 'opponent',
        search: {
          value: 'trainers.name',
          type: TableSearchType.TEXT,
        },
        sort: true,
        header: {
          component: 'displayText',
          data: 'OPPONENT',
        },
        content: {
          component: 'displayBattle',
          data: 'all',
        },
      },
    ],
    defaultSort: {
      column: 'date',
      direction: 'desc',
    },
  };

  public ngOnInit(): void {
    this.specificQuery = this.playerService.player$.pipe(
      map((value) => {
        return {
          'objectid.trainers': value?._id,
        };
      })
    );
  }
}
