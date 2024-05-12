import {
  Component,
  computed,
  DestroyRef,
  input,
  OnInit,
  signal,
} from '@angular/core';
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
  protected age = computed(() => this.calculateAge(this.actualDate()));
  protected actualDate = signal<Date>(null);

  constructor(
    private timeService: TimeService,
    private destroyRef: DestroyRef
  ) {}

  protected calculateAge(actualDate: Date): number {
    const birthday: Date = new Date(this.pokemon().birthday);
    let age = actualDate.getFullYear() - birthday.getFullYear();
    const monthDifference = actualDate.getMonth() - birthday.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && actualDate.getDate() < birthday.getDate())
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
        this.actualDate.set(date);
      });
  }
}
