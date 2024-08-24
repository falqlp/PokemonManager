import { AfterViewInit, Component, Input, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import * as echarts from 'echarts';
import { PieDataModel } from './pie.model';
import { TranslateService } from '@ngx-translate/core';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'pm-pie',
  standalone: true,
  imports: [],
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.scss'],
})
export class PieComponent implements AfterViewInit {
  protected document = inject<Document>(DOCUMENT);
  protected translateService = inject(TranslateService);

  protected _data: PieDataModel[];
  protected chart: echarts.ECharts;

  @Input() public colors: string[];

  @Input()
  public set data(value: PieDataModel[]) {
    this._data = value;
    this.updateChart();
  }

  public get data(): PieDataModel[] {
    return this._data;
  }

  public ngAfterViewInit(): void {
    const chartDom = this.document.getElementById('main');
    this.chart = echarts.init(chartDom as HTMLDivElement);
    this.updateChart();
  }

  protected updateChart(): void {
    if (!this.chart || !this._data) {
      return;
    }

    const option: EChartsOption = {
      darkmode: true,
      color: this.colors,
      tooltip: {
        trigger: 'item',
        formatter: (params): string => {
          if ('name' in params) {
            const imgAlt = params.name.toUpperCase();
            const imgSrc = `assets/types/displayText/${imgAlt}.png`;
            return `<div style="display: flex; flex-direction: column; align-items: center"><img class="type-displayText" src="${imgSrc}" alt="${imgAlt}" />${params.value} % </div>`;
          }
          return '';
        },
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['50%', '90%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderWidth: 3,
            borderColor: '#1c1c1c',
          },
          label: {
            show: false,
            position: 'center',
            formatter: (params): string => {
              return this.translateService.instant(params.name);
            },
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold',
              color: '',
            },
          },
          labelLine: {
            show: false,
          },
          data: this.data,
        },
      ],
    };

    this.chart.setOption(option);
  }
}
