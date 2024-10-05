import { Component } from '@angular/core';
import { PokemonModel } from '../../../models/PokemonModels/pokemon.model';
import { TranslateModule } from '@ngx-translate/core';
import { PokemonSummaryComponent } from '../../../components/pokemon-resume/pokemon-summary.component';
import { PokemonStorageComponent } from './pokemon-storage/pokemon-storage.component';

@Component({
  selector: 'app-pc-storage',
  templateUrl: './pc-storage.component.html',
  styleUrls: ['./pc-storage.component.scss'],
  standalone: true,
  imports: [TranslateModule, PokemonSummaryComponent, PokemonStorageComponent],
})
export class PcStorageComponent {
  protected firstSelected: PokemonModel;
  protected secondSelected: PokemonModel;

  protected onSelectionChange(selection: {
    firstSelected: PokemonModel;
    secondSelected: PokemonModel;
  }): void {
    this.firstSelected = selection.firstSelected;
    this.secondSelected = selection.secondSelected;
  }
}
