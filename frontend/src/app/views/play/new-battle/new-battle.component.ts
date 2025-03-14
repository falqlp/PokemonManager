import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  BattlePokemonModel,
  BattleStateModel,
  BattleTrainerModel,
  SIDE_EFFECT_LOG,
} from './battle.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { PlayerService } from '../../../services/player.service';
import {
  combineLatest,
  filter,
  first,
  map,
  Observable,
  startWith,
  switchMap,
} from 'rxjs';
import { TrainerNameComponent } from '../../../components/trainer-name/trainer-name.component';
import { BattleSceneComponent } from './components/battle-scene/battle-scene.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  BattleStatus,
  WebsocketEventService,
} from '../../../services/websocket-event.service';
import { RouterService } from '../../../services/router.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { BattleDamageInfo, DamageModel } from '../../../models/damage.model';
import { SideEffect } from '../../../models/move.model';
import { BattleQueriesService } from '../../../services/queries/battle-queries.service';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../../../environments/environment';
import { WebSocketModel } from '../../../services/websocket.service';

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
    MatProgressSpinnerModule,
    MatBadgeModule,
    AsyncPipe,
  ],
  templateUrl: './new-battle.component.html',
  styleUrl: './new-battle.component.scss',
})
export class NewBattleComponent implements OnInit, OnDestroy {
  private readonly translateService = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly playerService = inject(PlayerService);
  private readonly router = inject(RouterService);
  private readonly websocketEventService = inject(WebsocketEventService);
  private readonly battleQueriesService = inject(BattleQueriesService);

  @ViewChild('messages') public messageDiv: ElementRef;
  @Input('id') id: string;
  protected player: BattleTrainerModel;
  protected opponent: BattleTrainerModel;
  protected battleOrder: BattlePokemonModel[];
  protected battleMessage: string[][] = [];
  protected round = 0;
  protected roundMessage: string[] = [];
  protected battleLoop: number;
  protected defeat = false;
  protected askNextRound = false;
  protected askNextRoundLoop = false;
  protected disableButtons = false;
  protected updateBattleStatusEvent$: Observable<BattleStatus>;
  private socket: Socket;

  public ngOnInit(): void {
    this.socket = io(environment.wsUrl + '/battle-websocket', {
      forceNew: true,
      path: '/battle-websocket',
      transports: ['websocket'],
      withCredentials: true,
    });
    this.socket.on('message', (data: WebSocketModel) => {
      this.websocketEventService.handleMessage(data);
    });
    this.updateBattleStatusEvent$ =
      this.websocketEventService.updateBattleStatusEvent$.pipe(
        startWith({
          nextRound: false,
          nextRoundLoop: false,
          loopMode: false,
        })
      );
    this.playerService.player$
      .pipe(
        filter((player) => !!player),
        first(),
        switchMap((player) => {
          this.socket.emit('init', {
            battleId: this.id,
            trainerId: player._id,
          });
          return this.websocketEventService.init$.pipe(map(() => player));
        }),
        switchMap((player) => {
          return this.battleQueriesService.initTrainer(player._id, this.id);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
    combineLatest([
      this.playerService.player$,
      this.websocketEventService.battleEvent$.pipe(
        filter((battle) => battle._id === this.id)
      ),
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([player, battle]) => {
        this.askNextRound = false;
        this.askNextRoundLoop = false;
        if (!battle) {
          this.router.navigate(['play', 'battle-summary'], {
            queryParams: { battle: this.id },
          });
        } else {
          if (player._id === battle.opponent._id) {
            this.opponent = battle.player;
            this.player = battle.opponent;
          } else {
            this.player = battle.player;
            this.opponent = battle.opponent;
          }
          this.battleOrder = battle.battleOrder;
          this.nextRound(battle);
        }
      });
  }

  public ngOnDestroy(): void {
    this.socket.disconnect();
  }

  private nextRound(res: BattleStateModel): void {
    if (res.opponent.defeat || res.player.defeat) {
      this.onDefeat();
    }
    this.round += 1;
    const damage = res.damage;
    const isPlayerMoving = damage.attPokemon.trainerId === this.player._id;
    this.roundMessage = [];
    this.pushMessage('ROUND_X', { round: this.round });
    if (damage.info !== BattleDamageInfo.RELOAD) {
      this.pushMessage(
        isPlayerMoving ? 'MOVE_TO_OPPONENT_POKEMON' : 'MOVE_TO_PLAYER_POKEMON',
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
      this.logDamageEffectivness(damage);
      if (res.damage.move.sideEffect) {
        this.logSideEffectMessage(res.damage);
      }
      if (damage.defPokemon.currentHp === 0) {
        this.pushMessage(
          isPlayerMoving ? 'OPPONENT_POKEMON_KO' : 'PLAYER_POKEMON_KO',
          {
            pokemon:
              damage.defPokemon.nickname ??
              this.translateService.instant(damage.defPokemon.basePokemon.name),
          }
        );
      }
    } else {
      this.pushMessage('RELOADING_POKEMON', {
        attPokemon:
          damage.attPokemon.nickname ??
          this.translateService.instant(damage.attPokemon.basePokemon.name),
      });
    }
    this.battleMessage.push(this.roundMessage);
    this.scrollToBottom();
  }

  private logDamageEffectivness(damage: DamageModel): void {
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
            this.translateService.instant(damage.defPokemon.basePokemon.name),
        });
      } else {
        this.pushMessage('ITS_X', {
          effectivness: this.translateService.instant(damage.effectiveness),
        });
      }
    }
  }

  private logSideEffectMessage(damage: DamageModel): void {
    Object.keys(damage.move.sideEffect).forEach((effect) => {
      const message = SIDE_EFFECT_LOG[effect as SideEffect](
        damage.move.sideEffect[effect as SideEffect]
      );
      if (message) {
        this.pushMessage(message, {
          attPokemon:
            damage.attPokemon.nickname ??
            this.translateService.instant(damage.attPokemon.basePokemon.name),
          defPokemon:
            damage.defPokemon.nickname ??
            this.translateService.instant(damage.defPokemon.basePokemon.name),
        });
      }
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

  protected next(): void {
    this.askNextRound = true;
    this.disableButtons = true;
    this.playerService.player$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((player) => !!player),
        first(),
        switchMap((player) => {
          return this.battleQueriesService.askNextRound(player._id, this.id);
        })
      )
      .subscribe(() => {
        this.activateButtons();
      });
  }

  protected pause(): void {
    this.disableButtons = true;
    this.battleQueriesService
      .resetNextRound(this.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.activateButtons();
      });
  }

  protected loop(): void {
    this.disableButtons = true;
    this.askNextRoundLoop = true;
    this.playerService.player$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((player) => !!player),
        first(),
        switchMap((player) => {
          return this.battleQueriesService.askNextRoundLoop(
            player._id,
            this.id
          );
        })
      )
      .subscribe(() => {
        this.activateButtons();
      });
  }

  protected onDefeat(): void {
    this.defeat = true;
    clearInterval(this.battleLoop);
    setTimeout(() => {
      this.router.navigate(['play', 'battle-summary'], {
        queryParams: { battle: this.id },
      });
    }, 3000);
  }

  protected deleteAskNextRound(): void {
    this.disableButtons = true;
    this.askNextRound = false;
    this.playerService.player$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((player) => !!player),
        first(),
        switchMap((player) => {
          return this.battleQueriesService.deleteAskNextRound(
            player._id,
            this.id
          );
        })
      )
      .subscribe(() => {
        this.activateButtons();
      });
  }

  protected deleteAskNextRoundLoop(): void {
    this.disableButtons = true;
    this.askNextRoundLoop = false;
    this.playerService.player$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((player) => !!player),
        first(),
        switchMap((player) => {
          return this.battleQueriesService.deleteAskNextRoundLoop(
            player._id,
            this.id
          );
        })
      )
      .subscribe(() => {
        this.activateButtons();
      });
  }

  private activateButtons(): void {
    setTimeout(() => {
      this.disableButtons = false;
    }, 500);
  }
}
