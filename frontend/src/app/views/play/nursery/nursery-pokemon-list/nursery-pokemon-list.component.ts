import { Component, DestroyRef, inject, Input } from '@angular/core';
import { DisplayPokemonImageComponent } from '../../../../components/display-pokemon-image/display-pokemon-image.component';
import { NurseryModel } from '../../../../models/nursery.model';
import { NgClass } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { PokemonModel } from '../../../../models/PokemonModels/pokemon.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PokemonQueriesService } from '../../../../services/queries/pokemon-queries.service';
import { DisplayTypeComponent } from '../../../../components/display-type/display-type.component';

@Component({
  selector: 'pm-nursery-pokemon-list',
  standalone: true,
  imports: [
    DisplayPokemonImageComponent,
    NgClass,
    TranslateModule,
    MatButtonModule,
    DisplayTypeComponent,
  ],
  templateUrl: './nursery-pokemon-list.component.html',
  styleUrls: ['./nursery-pokemon-list.component.scss'],
})
export class NurseryPokemonListComponent {
  protected pokemonQueriesService = inject(PokemonQueriesService);
  protected destroyRef = inject(DestroyRef);

  @Input() public nursery: NurseryModel;

  protected release(egg: PokemonModel): void {
    this.pokemonQueriesService
      .release(egg._id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.nursery.eggs = this.nursery.eggs.filter(
          (pokemon) => pokemon._id !== egg._id
        );
      });
  }
}
