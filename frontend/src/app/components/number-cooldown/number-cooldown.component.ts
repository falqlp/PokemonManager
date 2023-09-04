import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-number-cooldown',
  templateUrl: './number-cooldown.component.html',
  styleUrls: ['./number-cooldown.component.scss'],
})
export class NumberCooldownComponent {
  @Input() public set cooldown(value: number) {
    this._cooldown = value;
  }

  public get cooldown(): number {
    return this._cooldown;
  }

  protected _cooldown: number;
}
