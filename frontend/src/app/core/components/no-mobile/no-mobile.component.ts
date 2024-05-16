import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'pm-no-mobile',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, TranslateModule],
  templateUrl: './no-mobile.component.html',
  styleUrl: './no-mobile.component.scss',
})
export class NoMobileComponent {
  @Output() show = new EventEmitter<boolean>();
}
