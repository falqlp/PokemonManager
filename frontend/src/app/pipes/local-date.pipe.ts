import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localDate',
  standalone: true,
})
export class LocalDatePipe implements PipeTransform {
  transform(value: Date): string {
    return this.dateToLocalDate(value);
  }

  private dateToLocalDate(date: Date): string {
    date = new Date(date);
    if (!date) {
      return '';
    }
    return date.toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  }
}
