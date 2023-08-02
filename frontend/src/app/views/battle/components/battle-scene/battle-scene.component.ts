import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import type { PokemonModel } from 'src/app/models/PokemonModels/pokemon.model';
import { DamageModel } from '../../../../models/damage.model';

@Component({
  selector: 'app-battle-scene',
  templateUrl: './battle-scene.component.html',
  styleUrls: ['./battle-scene.component.scss'],
})
export class BattleSceneComponent {
  @ViewChild('start') protected startBtn: ElementRef;

  @Input() public opponentActivePokemon: PokemonModel;
  @Input() public opponentDamage: DamageModel;
  @Input() public playerActivePokemon: PokemonModel;
  @Input() public playerDamage: DamageModel;
  @Input() public canStart: boolean;
  @Output() public battleStart = new EventEmitter<void>();
  protected started = false;

  protected onStart(): void {
    if (this.canStart) {
      this.battleStart.emit();
      this.started = true;
    } else {
      const button = this.startBtn.nativeElement;
      button.classList.add('shake');
      button.addEventListener('animationend', () => {
        button.classList.remove('shake');
      });
    }
  }
}
