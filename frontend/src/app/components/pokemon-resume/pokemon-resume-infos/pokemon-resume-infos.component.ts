import { Component, DestroyRef, input, OnInit } from '@angular/core';
import { PokemonModel } from '../../../models/PokemonModels/pokemon.model';
import { LocalDatePipe } from '../../../pipes/local-date.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { TimeService } from '../../../services/time.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'pm-pokemon-resume-infos',
  standalone: true,
  imports: [LocalDatePipe, TranslateModule],
  templateUrl: './pokemon-resume-infos.component.html',
  styleUrl: './pokemon-resume-infos.component.scss',
})
export class PokemonResumeInfosComponent implements OnInit {
  public pokemon = input<PokemonModel>();
  protected age: number;

  constructor(
    private timeService: TimeService,
    private destroyRef: DestroyRef
  ) {}

  protected calculateAge(actualDate: Date): number {
    let age = actualDate.getFullYear() - this.pokemon().birthday.getFullYear();
    const monthDifference =
      actualDate.getMonth() - this.pokemon().birthday.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 &&
        actualDate.getDate() < this.pokemon().birthday.getDate())
    ) {
      age -= 1;
    }
    return age;
  }

  public ngOnInit(): void {
    this.timeService
      .getActualDate()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((date) => {
        this.age = this.calculateAge(date);
      });
  }
}
