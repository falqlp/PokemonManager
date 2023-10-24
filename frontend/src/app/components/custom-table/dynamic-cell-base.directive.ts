import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[pmDynamicCellBase]',
  standalone: true,
})
export class DynamicCellBaseDirective<T> {
  @Input() public data: T;
}
