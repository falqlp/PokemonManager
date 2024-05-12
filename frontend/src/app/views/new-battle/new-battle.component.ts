import {
  Component,
  DestroyRef,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BattleInstanceQueriesService } from '../../services/queries/battle-instance-queries.service';
import { BattlePokemonModel, BattleTrainerModel } from './battle.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgClass } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { BattleQueriesService } from './battle-queries.service';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { PlayerService } from '../../services/player.service';
import { combineLatest } from 'rxjs';
import { Router } from '@angular/router';
import { TrainerNameComponent } from '../../components/trainer-name/trainer-name.component';
import { BattleSceneComponent } from './components/battle-scene/battle-scene.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'pm-new-battle',
  standalone: true,
  imports: [
    TranslateModule,
    NgClass,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    TrainerNameComponent,
    BattleSceneComponent,
    MatTooltipModule,
  ],
  templateUrl: './new-battle.component.html',
  styleUrl: './new-battle.component.scss',
})
export class NewBattleComponent implements OnInit {
  @ViewChild('messages') public messageDiv: ElementRef;
  @Input('id') id: string;
  protected player: BattleTrainerModel;
  protected opponent: BattleTrainerModel;
  protected battleOrder: BattlePokemonModel[];
  protected battleMessage: string[][] = [];
  protected round = 0;
  protected roundMessage: string[] = [];
  protected loopMode = false;
  protected battleLoop: number;
  private playerId: string; // id dans le battleInstance
  protected defeat = false;

  constructor(
    protected battleInstanceQueriesService: BattleInstanceQueriesService,
    protected battleQueriesService: BattleQueriesService,
    protected translateService: TranslateService,
    protected destroyRef: DestroyRef,
    protected playerService: PlayerService,
    protected router: Router
  ) {}

  public ngOnInit(): void {
    combineLatest([
      this.playerService.player$,
      this.battleInstanceQueriesService.initBattle(this.id),
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([player, battle]) => {
        if (!battle) {
          this.router.navigate(['battle-resume'], {
            queryParams: { battle: this.id },
          });
        } else {
          this.playerId = battle.player._id;
          if (player._id === battle.opponent._id) {
            this.opponent = battle.player;
            this.player = battle.opponent;
          } else {
            this.player = battle.player;
            this.opponent = battle.opponent;
          }
          this.battleOrder = battle.battleOrder;
        }
      });
  }

  protected next(): void {
    this.battleQueriesService
      .simulateBattleRound(this.player, this.opponent, this.battleOrder)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.round += 1;
        this.player = res.player;
        this.opponent = res.opponent;
        this.battleOrder = res.battleOrder;
        const damage = res.damage;
        const isPlayerMoving = damage.attPokemon.trainerId === this.player._id;
        this.roundMessage = [];
        this.pushMessage('ROUND_X', { round: this.round });
        this.pushMessage(
          isPlayerMoving
            ? 'MOVE_TO_OPPONENT_POKEMON'
            : 'MOVE_TO_PLAYER_POKEMON',
          {
            attPokemon:
              damage.attPokemon.nickname ??
              this.translateService.instant(damage.attPokemon.basePokemon.name),
            move: this.translateService.instant(damage.move.name),
            defPokemon:
              damage.defPokemon.nickname ??
              this.translateService.instant(damage.defPokemon.basePokemon.name),
          }
        );
        if (damage.missed) {
          this.pushMessage('MISSED!');
        } else {
          if (damage.critical) {
            this.pushMessage('CRITICAL_HIT!');
          }
          if (damage.effectiveness === 'IMMUNE') {
            this.pushMessage('IT_DOES_NOT_AFFECT_X', {
              pokemon:
                damage.defPokemon.nickname ??
                this.translateService.instant(
                  damage.defPokemon.basePokemon.name
                ),
            });
          } else {
            this.pushMessage('ITS_X', {
              effectivness: this.translateService.instant(damage.effectiveness),
            });
          }
        }
        if (damage.defPokemon.currentHp === 0) {
          this.pushMessage(
            isPlayerMoving ? 'OPPONENT_POKEMON_KO' : 'PLAYER_POKEMON_KO',
            {
              pokemon:
                damage.defPokemon.nickname ??
                this.translateService.instant(
                  damage.defPokemon.basePokemon.name
                ),
            }
          );
        }
        if (this.player.defeat) {
          this.onDefeat(this.player);
        }
        if (this.opponent.defeat) {
          this.onDefeat(this.opponent);
        }
        this.battleMessage.push(this.roundMessage);
        this.scrollToBottom();
      });
  }

  private pushMessage(key: string, translateParams?: any): void {
    this.roundMessage.push(this.translateService.instant(key, translateParams));
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      this.messageDiv.nativeElement.scrollTop =
        this.messageDiv.nativeElement.scrollHeight;
    });
  }

  protected pause(): void {
    this.loopMode = false;
    clearInterval(this.battleLoop);
  }

  protected loop(): void {
    this.loopMode = true;
    this.next();
    this.battleLoop = setInterval(() => this.next(), 6000);
  }

  public onDefeat(trainer: BattleTrainerModel): void {
    this.defeat = true;
    clearInterval(this.battleLoop);
    setTimeout(() => {
      this.battleInstanceQueriesService
        .setWinner(this.id, trainer._id, this.playerId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.router.navigate(['battle-resume'], {
            queryParams: { battle: this.id },
          });
        });
    }, 3000);
  }
}
