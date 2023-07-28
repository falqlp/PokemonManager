import { Component, Input } from '@angular/core';
import { TrainerModel } from '../../../../models/TrainersModels/trainer.model';
import { AttackModel } from '../../../../models/attack.model';

@Component({
  selector: 'app-battle-oppenent-pokemons',
  templateUrl: './battle-oppenent-pokemons.component.html',
  styleUrls: ['./battle-oppenent-pokemons.component.scss'],
})
export class BattleOppenentPokemonsComponent {
  @Input() public trainer: TrainerModel;
  @Input() public selectedAttack: AttackModel;
  protected progress = 0;
}
