import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { BattleEventsQueriesService } from '../../../../services/queries/battle-events-queries.service';
import {
  BattleEventQueryType,
  DamageEventQueryModel,
  SortOrder,
  StatsByPokemonModel,
} from '../../../../models/battle-events.model';
import { NgxEchartsDirective } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { TranslateService } from '@ngx-translate/core';
import { NumberFormatterPipe } from '../../../../pipes/number-formatter.pipe';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'pm-battle-events-stats-graph',
  standalone: true,
  imports: [NgxEchartsDirective, MatPaginator, MatProgressBar],
  templateUrl: './battle-events-stats-graph.component.html',
  styleUrl: './battle-events-stats-graph.component.scss',
  providers: [NumberFormatterPipe],
})
export class BattleEventsStatsGraphComponent {
  private readonly battleEventsQueriesService: BattleEventsQueriesService =
    inject(BattleEventsQueriesService);

  private readonly translateService: TranslateService =
    inject(TranslateService);

  private readonly numberFormatterPipe: NumberFormatterPipe =
    inject(NumberFormatterPipe);

  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  protected readonly pageSizeOption = [5, 10, 15, 20, 50, 100];

  public type = input.required<BattleEventQueryType>();
  public isRelative = input.required<boolean>();
  public query? = input<DamageEventQueryModel>({});
  public sort? = input<SortOrder>(-1);
  protected totalElements = signal<number>(0);
  protected pageIndex = signal(0);
  protected isloading = true;
  protected matPaginatorEvent = signal<PageEvent>({
    length: 0,
    pageIndex: 0,
    pageSize: 20,
  });

  protected options = computed<EChartsOption>(() => {
    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (param): string => {
          const data = (param as any)[0].data.data as StatsByPokemonModel;
          return this.getTooltip(data);
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: this.stats().map((stat) => stat.pokemon.basePokemon.name),
          axisTick: {
            alignWithLabel: true,
          },
          axisLabel: {
            formatter: (params): string => {
              return '{' + params + '| }';
            },
            rich: this.stats().length !== 0 ? this.getDictionary() : {},
            interval: 0,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      legend: {
        textStyle: {
          color: 'white',
        },
        selectorLabel: {
          color: 'black',
        },
      },
      series: this.seriesData().map((serie, index) => {
        return {
          name: this.allTrainers()[index].name,
          type: 'bar',
          barWidth: '60%',
          stack: 'pokemon',
          color: this.allTrainers()[index].color,
          data: this.stats().map((stat, i) => {
            return {
              value: serie[i],
              data: stat,
              itemStyle: {
                borderRadius: [100, 100, 0, 0],
              },
            };
          }),
        };
      }),
    };
  });

  private stats = computed<StatsByPokemonModel[]>(() => {
    const start = this.pageIndex() * this.matPaginatorEvent()?.pageSize;
    const end = (this.pageIndex() + 1) * this.matPaginatorEvent()?.pageSize;
    return this.data().slice(start, end);
  });

  private data = signal<StatsByPokemonModel[]>([]);
  constructor() {
    effect(() => {
      this.isloading = true;
      this.battleEventsQueriesService
        .getBattleEventStats(
          this.type(),
          this.isRelative(),
          this.query(),
          this.sort()
        )
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((data) => {
          this.isloading = false;
          this.totalElements.set(data.length);
          this.pageIndex.set(0);
          this.data.set(data);
        });
    });
  }

  private getDictionary(): any {
    const record: Record<string, any> = {};
    this.stats().forEach((stat) => {
      record[stat.pokemon.basePokemon.name] = {
        height: 30,
        width: 30,
        align: 'left',
        backgroundColor: {
          image: `assets/pokemons/Icons${stat.pokemon.shiny ? ' shiny' : ''}/${
            stat.pokemon.basePokemon.name
          }.png`,
        },
      };
    });
    return record;
  }

  private getTooltip(data: StatsByPokemonModel): string {
    let tooltip = `<strong>${this.translateService.instant(
      data.pokemon.basePokemon.name
    )}</strong>`;
    tooltip += '<br/>';
    if (data.trainer.class) {
      tooltip += `${this.translateService.instant(data.trainer.class)} `;
    }
    tooltip += ` ${this.translateService.instant(data.trainer.name)}`;
    tooltip += '<br/>';
    tooltip += ` ${this.numberFormatterPipe.transform(
      data.value
    )} ${this.translateService.instant(this.type())}${
      this.isRelative() &&
      this.type() !== BattleEventQueryType.BATTLE_PARTICIPATION
        ? this.translateService.instant('BATTLE_RELATIVE')
        : ''
    }`;
    return tooltip;
  }

  private allTrainers = computed<any[]>(() => {
    const trainers: any[] = [];
    this.stats().forEach((stat) => {
      if (!trainers.find((trainer) => trainer._id === stat.trainer._id)) {
        trainers.push(stat.trainer);
      }
    });
    return trainers;
  });

  private seriesData = computed(() => {
    const trainerIds = this.allTrainers().map((trainer) => trainer._id);
    const seriesData: number[][] = [];
    trainerIds.forEach(() => {
      seriesData.push([]);
    });
    this.stats().forEach((stat) => {
      trainerIds.forEach((id, index) => {
        seriesData[index].push(stat.trainer._id === id ? stat.value : 0);
      });
    });
    return seriesData;
  });

  protected pageChange(event: PageEvent): void {
    this.matPaginatorEvent.set(event);
    this.pageIndex.set(event.pageIndex);
  }
}
