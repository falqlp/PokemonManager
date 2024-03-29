import {
  ComponentRef,
  Directive,
  Input,
  OnInit,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { TableDisplayTextComponent } from './components/table-display-text/table-display-text.component';
import { DynamicCellBaseDirective } from './dynamic-cell-base.directive';
import { TableDisplayTrainerPokemonsComponent } from './components/table-display-trainer-pokemons/table-display-trainer-pokemons.component';
import { TableDisplayPokemonIconComponent } from './components/table-display-icon/table-display-pokemon-icon.component';
import { TableDisplayTypesComponent } from './components/table-display-types/table-display-types.component';

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
    displayPokemonIcon: TableDisplayPokemonIconComponent,
    displayPokemonTypes: TableDisplayTypesComponent,
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
