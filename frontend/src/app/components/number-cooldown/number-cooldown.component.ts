import { Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-number-cooldown',
  templateUrl: './number-cooldown.component.html',
  styleUrls: ['./number-cooldown.component.scss'],
  imports: [],
})
export class NumberCooldownComponent {
  public cooldown = input<number>();
}
