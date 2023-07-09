import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import type { PokemonModel } from 'src/app/models/PokemonModels/pokemon.model';

@Component({
  selector: 'app-pokemon-info',
  templateUrl: './pokemon-info.component.html',
  styleUrls: ['./pokemon-info.component.scss'],
})
export class PokemonInfoComponent {
  protected img: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: PokemonModel) {}

  public ngOnInit(): void {
    this.setImgNumber();
  }

  protected setImgNumber(): void {
    this.img =
      'assets/images/max-size/' +
      this.data.basePokemon.id.toString().padStart(3, '0') +
      '.png';
  }
}
