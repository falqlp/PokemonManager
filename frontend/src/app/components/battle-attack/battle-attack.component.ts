import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { PokemonModel } from 'src/app/models/PokemonModels/pokemon.model';
import { AttackModel } from 'src/app/models/attack.model';

@Component({
  selector: 'app-battle-attack',
  templateUrl: './battle-attack.component.html',
  styleUrls: ['./battle-attack.component.scss'],
})
export class BattleAttackComponent implements OnInit {
  @Input() public activePokemon: PokemonModel;
  protected attacks: AttackModel[];
  constructor(protected http: HttpClient) {}

  public ngOnInit(): void {
    if (this.activePokemon?.attacks) {
      this.http
        .post<AttackModel[]>('api/attack', this.activePokemon.attacks)
        .subscribe((attacks) => {
          this.attacks = attacks;
        });
    }
  }
}
