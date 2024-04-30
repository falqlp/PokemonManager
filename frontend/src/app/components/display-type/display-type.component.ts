import { Component, computed, input, Input } from '@angular/core';
import { NgClass, NgForOf } from '@angular/common';

@Component({
  selector: 'pm-display-type',
  standalone: true,
  imports: [NgForOf, NgClass],
  templateUrl: './display-type.component.html',
  styleUrls: ['./display-type.component.scss'],
})
export class DisplayTypeComponent {
  public types = input<string[] | string>();
  public displayText = input<boolean>(true);
  public typesArray = computed(() => {
    return Array.isArray(this.types())
      ? (this.types() as string[])
      : [this.types() as string];
  });
}
