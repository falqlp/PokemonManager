import { Component, Input, OnInit } from '@angular/core';
import { ColorService } from '../../services/color.service';

@Component({
  selector: 'app-circular-progress-bar',
  templateUrl: './circular-progress-bar.component.html',
  styleUrls: ['./circular-progress-bar.component.scss'],
})
export class CircularProgressBarComponent implements OnInit {
  @Input() public progress: number;
  @Input() public min = 0;
  @Input() public max = 100;
  protected currentProgress: number;
  protected svg: { x: number; y: number };
  protected rgb: string;

  public constructor(protected colorService: ColorService) {}

  public ngOnInit(): void {
    this.calculateProgress();
    this.rgb = this.colorService.hpPourcentToRGB(this.currentProgress);
  }

  protected calculateProgress(): void {
    this.currentProgress = (100 * this.progress) / (this.max - this.min);
    this.svg = {
      y: 50 + -50 * Math.cos((this.currentProgress * Math.PI) / 50),
      x: 50 + -50 * Math.sin((this.currentProgress * Math.PI) / 50),
    };
  }
}
