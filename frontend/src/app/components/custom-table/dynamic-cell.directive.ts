import {
  ComponentRef,
  Directive,
  Inject,
  Input,
  OnInit,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { TableDisplayTextComponent } from './components/table-display-text/table-display-text.component';
import { DynamicCellBaseDirective } from './dynamic-cell-base.directive';
import { TableDisplayTrainerPokemonsComponent } from './components/table-display-trainer-pokemons/table-display-trainer-pokemons.component';

@Directive({
  selector: '[pmDynamicCell]',
  standalone: true,
})
export class DynamicCellDirective<T> implements OnInit {
  @Input() public componentType: string;
  @Input() public data: T;

  protected components: Record<string, Type<DynamicCellBaseDirective<any>>> = {
    displayText: TableDisplayTextComponent,
    displayTrainerPokemons: TableDisplayTrainerPokemonsComponent,
  };

  constructor(public viewContainerRef: ViewContainerRef) {}

  public ngOnInit(): void {
    if (this.componentType) {
      const component: ComponentRef<DynamicCellBaseDirective<T>> =
        this.viewContainerRef.createComponent(
          this.components[this.componentType]
        );
      component.instance.data = this.data;
    }
  }
}
