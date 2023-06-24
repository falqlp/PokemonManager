import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, map, startWith } from 'rxjs';
import { PokemonModel } from 'src/app/models/PokemonModels/pokemon.model';
import { PokemonBaseModel } from 'src/app/models/PokemonModels/pokemonBase.model';

@Component({
  selector: 'app-pokemon-form',
  templateUrl: './pokemon-form.component.html',
  styleUrls: ['./pokemon-form.component.scss'],
})
export class PokemonFormComponent implements OnInit {
  pokemonForm = new FormGroup({
    pokemon: new FormControl('', Validators.required),
    nickname: new FormControl(''),
    level: new FormControl(0, Validators.required),
  });

  options: PokemonBaseModel[];
  filteredPokemons: Observable<PokemonBaseModel[]>;

  constructor(
    protected dialogRef: MatDialogRef<PokemonFormComponent>,
    protected http: HttpClient
  ) {}

  public ngOnInit(): void {
    this.http
      .get<PokemonBaseModel[]>('api/PokemonBase')
      .subscribe((pokemons) => {
        this.options = pokemons;
        this.filteredPokemons =
          this.pokemonForm.controls.pokemon.valueChanges.pipe(
            startWith(''),
            map((value) => this.filter(value as string))
          );
      });
  }

  protected filter(value: string): PokemonBaseModel[] {
    const filterValue = value.toLowerCase();

    return this.options.filter((option) =>
      option.name.toLowerCase().startsWith(filterValue)
    );
  }

  protected submit(): void {
    this.dialogRef.close({
      trainerId: '6496f985f15bc10f660c1958',
      nickname: this.pokemonForm.controls.nickname.value,
      basePokemon: this.options.find(
        (option) => option.name === this.pokemonForm.controls.pokemon.value
      ),
      level: this.pokemonForm.controls.level.value,
    } as PokemonModel);
  }
}
