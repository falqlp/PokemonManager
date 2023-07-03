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
  protected selectedAttack: AttackModel;
  protected disabled = false;
  protected progress = 0;
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

  protected onClick(attack: AttackModel): void {
    this.selectedAttack = attack;
    this.disabled = true;
    this.progress = 100;

    const interval = setInterval(() => {
      this.progress -= 1; // ajustez cette valeur en fonction de la durée du cooldown
      if (this.progress <= 0) {
        clearInterval(interval);
        this.disabled = false;
        this.progress = 0;
      }
    }, 50); // ajustez cette valeur en fonction de la durée du cooldown
  }
}
