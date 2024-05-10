import { Injectable } from '@angular/core';
import {
  POKEMON_NATURES,
  PokemonModel,
} from '../models/PokemonModels/pokemon.model';

@Injectable({
  providedIn: 'root',
})
export class ColorService {
  public hpPourcentToRGB(pourcent: number): string {
    const red = Math.floor(((100 - pourcent) * 128) / 50);
    const green = Math.floor((pourcent * 128) / 50);
    return (
      'rgb(' +
      (red > 128 ? 128 : red) +
      ', ' +
      (green > 128 ? 128 : green) +
      ', 0)'
    );
  }

  public getColorByType(type: string): string {
    switch (type) {
      case 'ELECTRIC':
        return '#fac000';
      case 'GRASS':
        return '#3fa129';
      case 'NORMAL':
        return '#9fa19f';
      case 'WATER':
        return '#2980ef';
      case 'FAIRY':
        return '#ef70ef';
      case 'BUG':
        return '#91a119';
      case 'FIRE':
        return '#e62829';
      case 'DRAGON':
        return '#5060e1';
      case 'ROCK':
        return '#afa981';
      case 'GROUND':
        return '#915121';
      case 'POISON':
        return '#9141cb';
      case 'PSY':
        return '#ef4179';
      case 'DARK':
        return '#50413f';
      case 'GHOST':
        return '#704170';
      case 'FIGHTING':
        return '#ff8000';
      case 'STEEL':
        return '#60a1b8';
      case 'ICE':
        return '#3fd8ff';
      case 'FLYING':
        return '#81b9ef';
      default:
        return '#FFFFFF';
    }
  }

  public getNatureColor(pokemon: PokemonModel, key: string): string {
    if (POKEMON_NATURES[pokemon.nature][key] > 0) {
      return '#166e16';
    } else if (POKEMON_NATURES[pokemon.nature][key] < 0) {
      return '#881818';
    }
    return '';
  }
}
