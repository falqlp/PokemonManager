import type { OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { PokemonModel } from 'src/app/models/PokemonModels/pokemon.model';
import type { AttackModel } from 'src/app/models/attack.model';
import { AttackQueriesService } from '../../../../services/attack-queries.service';

@Component({
  selector: 'app-battle-attack',
  templateUrl: './battle-attack.component.html',
  styleUrls: ['./battle-attack.component.scss'],
})
export class BattleAttackComponent implements OnInit, OnChanges {
  @Input() public activePokemon: PokemonModel;
  @Output() public onAttackChange = new EventEmitter<AttackModel>();
  protected attacks: AttackModel[];
  protected selectedAttack: AttackModel;
  protected disabled = false;
  protected progress = 0;
  public constructor(protected attackQueriesService: AttackQueriesService) {}

  public ngOnInit(): void {
    this.getAttacks();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['activePokemon']) {
      this.getAttacks();
      this.selectedAttack = undefined;
      this.onAttackChange.emit(this.selectedAttack);
      this.setCooldown();
    }
  }

  protected onClick(attack: AttackModel): void {
    this.selectedAttack = attack;
    this.onAttackChange.emit(this.selectedAttack);
    this.setCooldown();
  }

  protected getAttacks(): void {
    if (this.activePokemon?.attacks) {
      this.attacks = this.activePokemon.attacks;
    }
  }

  protected setCooldown(): void {
    this.disabled = true;
    this.progress = 100;
    const interval = setInterval(() => {
      this.progress -= 1;
      if (this.progress <= 0) {
        clearInterval(interval);
        this.disabled = false;
        this.progress = 0;
      }
    }, 6 + 200 / Math.sqrt(this.activePokemon.stats.spe));
  }
}
