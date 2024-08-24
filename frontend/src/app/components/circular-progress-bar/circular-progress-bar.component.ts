import { Component, Input, OnInit, inject } from '@angular/core';
import { ColorService } from '../../services/color.service';

@Component({
  selector: 'app-circular-progress-bar',
  templateUrl: './circular-progress-bar.component.html',
  styleUrls: ['./circular-progress-bar.component.scss'],
  standalone: true,
  imports: [],
})
export class CircularProgressBarComponent implements OnInit {
  protected colorService = inject(ColorService);

  @Input() public currentProgress: number;
  @Input() public min = 0;
  @Input() public max = 100;
  protected progress: number;
  protected svg: { x: number; y: number };
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
    this.svg = {
      y: 50 + -50 * Math.cos((this.progress * Math.PI) / 50),
      x: 50 + -50 * Math.sin((this.progress * Math.PI) / 50),
    };
    this.rgb = this.colorService.hpPourcentToRGB(this.progress);
  }
}
