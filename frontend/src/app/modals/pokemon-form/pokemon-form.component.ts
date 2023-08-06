import { HttpClient } from '@angular/common/http';
import type { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import type { Observable } from 'rxjs';
import { map, startWith } from 'rxjs';
import type { PokemonModel } from 'src/app/models/PokemonModels/pokemon.model';
import type { PokemonBaseModel } from 'src/app/models/PokemonModels/pokemonBase.model';
import { TrainerQueriesService } from '../../services/trainer-queries.service';
import { TrainerModel } from '../../models/TrainersModels/trainer.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-pokemon-form',
  templateUrl: './pokemon-form.component.html',
  styleUrls: ['./pokemon-form.component.scss'],
})
export class PokemonFormComponent implements OnInit {
  pokemonForm = new FormGroup({
    pokemon: new FormControl('', Validators.required),
    nickname: new FormControl(''),
    level: new FormControl(1, [
      Validators.required,
      Validators.min(1),
      Validators.max(100),
    ]),
    trainer: new FormControl('kjg', Validators.required),
  });

  trainers: TrainerModel[];
  pokemons: PokemonBaseModel[];
  filteredPokemons: Observable<PokemonBaseModel[]>;

  constructor(
    protected dialogRef: MatDialogRef<PokemonFormComponent>,
    protected http: HttpClient,
    protected trainerService: TrainerQueriesService,
    protected translateService: TranslateService
  ) {}

  public ngOnInit(): void {
    this.http
      .get<PokemonBaseModel[]>('api/pokemonBase')
      .subscribe((pokemons) => {
        this.pokemons = pokemons.sort((a, b) => a.id - b.id);
        this.filteredPokemons =
          this.pokemonForm.controls.pokemon.valueChanges.pipe(
            startWith(''),
            map((value) => this.filter(value as string))
          );
      });
    this.trainerService.getAll().subscribe((trainers) => {
      this.trainers = trainers.sort((a, b) => a.name.localeCompare(b.name));
    });
  }

  protected filter(value: string): PokemonBaseModel[] {
    const filterValue = value.toLowerCase();

    return this.pokemons.filter((option) =>
      this.translateService
        .instant(option.name)
        .toLowerCase()
        .startsWith(filterValue)
    );
  }

  protected submit(): void {
    this.dialogRef.close({
      trainerId: this.pokemonForm.controls.trainer.value,
      nickname: this.pokemonForm.controls.nickname.value,
      basePokemon: this.pokemons.find(
        (option) => option.name === this.pokemonForm.controls.pokemon.value
      ),
      level: this.pokemonForm.controls.level.value,
    } as PokemonModel);
  }
}
