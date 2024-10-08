import type { OnInit } from '@angular/core';
import { Component, Input, inject } from '@angular/core';
import { ColorService } from '../../services/color.service';
import { TranslateModule } from '@ngx-translate/core';
import { NgClass } from '@angular/common';

@Component({
  standalone: true,
  selector: 'progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
  imports: [TranslateModule, NgClass],
})
export class ProgressBarComponent implements OnInit {
  protected colorService = inject(ColorService);

  @Input() public style = 'level';
  @Input() public displayHp = true;
  @Input()
  public set currentProgress(value: number) {
    this._currentProgress = value;
    this.updateProgress();
  }

  public get currentProgress(): number {
    return this._currentProgress;
  }

  @Input()
  public set max(value: number) {
    this._max = value;
    this.updateProgress();
  }

  public get max(): number {
    return this._max ?? 100;
  }

  @Input()
  public set min(value: number) {
    this._min = value;
    this.updateProgress();
  }

  public get min(): number {
    return this._min ?? 0;
  }

  protected _min: number;
  protected _max: number;
  protected _currentProgress: number;
  protected progress: number;
  protected rgb: string;

  public ngOnInit(): void {
    this.updateProgress();
  }

  protected updateProgress(): void {
    if (this.currentProgress < this.min) {
      this.progress = this.min;
    } else if (this.currentProgress > this.max) {
      this.progress = this.max;
    } else {
      this.progress =
        ((this.currentProgress - this.min) * 100) / (this.max - this.min);
    }
    this.rgb = this.colorService.hpPourcentToRGB(this.progress);
  }
}
