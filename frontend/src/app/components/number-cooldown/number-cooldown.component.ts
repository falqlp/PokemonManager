import { Component, input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-number-cooldown',
  templateUrl: './number-cooldown.component.html',
  styleUrls: ['./number-cooldown.component.scss'],
  imports: [NgIf],
})
export class NumberCooldownComponent {
  public cooldown = input<number>();
}
