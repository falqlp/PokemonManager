import { Component, Input, OnInit } from '@angular/core';
import { PokemonBaseModel } from '../../models/PokemonModels/pokemonBase.model';

@Component({
  selector: 'pokemon-panel',
  templateUrl: './pokemon-panel.component.html',
  styleUrls: ['./pokemon-panel.component.scss'],
})
export class PokemonPanelComponent implements OnInit {
  @Input() public pokemon: PokemonBaseModel;
  protected img: string;

  public ngOnInit(): void {
    this.setImgNumber();
  }

  protected setImgNumber(): void {
    this.img =
      'assets/images/max-size/' +
      this.pokemon.id.toString().padStart(3, '0') +
      '.png';
  }
}
