import { Injectable } from '@angular/core';

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
}
