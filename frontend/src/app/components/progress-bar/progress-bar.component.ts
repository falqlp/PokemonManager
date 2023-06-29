import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
})
export class ProgressBarComponent implements OnInit {
  @Input() public style = 'level';
  @Input() public max = 100;
  @Input() public min = 0;
  @Input()
  public set currentProgress(value: number) {
    this._currentProgress = value;
    this.updateProgress();
  }

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
}
