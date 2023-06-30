import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent implements OnInit {
  @Input() public style = 'level';
  @Input()
  public set currentProgress(value: number) {
    this._currentProgress = value;
    this.updateProgress();
  }
  @Input()
  public set max(value: number) {
    this._max = value;
    this.updateProgress();
  }
  @Input()
  public set min(value: number) {
    this._min = value;
    this.updateProgress();
  }

  protected _min: number;
  protected _max: number;
  protected _currentProgress: number;
  protected progress: number;

  public ngOnInit(): void {
    this.updateProgress();
  }

  protected updateProgress(): void {
    this.progress =
      this.currentProgress - this.min === 0
        ? 0
        : ((this.currentProgress - this.min) * 100) / (this.max - this.min);
  }

  public get currentProgress(): number {
    return this._currentProgress;
  }
  public get max(): number {
    return this._max ?? 100;
  }
  public get min(): number {
    return this._min ?? 0;
  }
}
