import { Component, Input, OnInit } from '@angular/core';
import { NgClass, NgForOf } from '@angular/common';

@Component({
  selector: 'pm-display-type',
  standalone: true,
  imports: [NgForOf, NgClass],
  templateUrl: './display-type.component.html',
  styleUrls: ['./display-type.component.scss'],
})
export class DisplayTypeComponent implements OnInit {
  @Input() public types: string[] | string;
  @Input() public displayText = true;
  public typesArray: string[];

  public ngOnInit(): void {
    this.typesArray = Array.isArray(this.types) ? this.types : [this.types];
  }
}
