import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberFormatter',
  standalone: true,
})
export class NumberFormatterPipe implements PipeTransform {
  transform(value: number): string {
    if (value < 1000) {
      return value.toString();
    } else if (value < 1000000) {
      return this.formatValue(value, 1000, 'k');
    } else if (value < 1000000000) {
      return this.formatValue(value, 1000000, 'M');
    } else {
      return this.formatValue(value, 1000000000, 'B');
    }
  }

  private formatValue(value: number, divisor: number, suffix: string): string {
    const result = value / divisor;
    let decimals = 0;
    if (value < 10 * divisor) {
      decimals = 2;
    } else if (value < 100 * divisor) {
      decimals = 1;
    }
    return result.toFixed(decimals) + suffix;
  }
}
