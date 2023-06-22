import { Component, Input, OnInit } from '@angular/core';
import { PokemonBaseModel } from '../pokemon.model';

@Component({
  selector: 'pokemon-panel',
  templateUrl: './pokemon-panel.component.html',
  styleUrls: ['./pokemon-panel.component.scss'],
})
export class PokemonPanelComponent implements OnInit {
  @Input() public pokemon: PokemonBaseModel;
  protected imgNumber: string;

  public ngOnInit(): void {
    this.setImgNumber();
  }

  protected setImgNumber(): void {
    if (!this.pokemon) {
      return;
    }
    this.imgNumber = this.pokemon.id.toString().padStart(3, '0');
  }
}
