import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  BattlePokemonModel,
  BattleStateModel,
  BattleTrainerModel,
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
import { BattleInstanceQueriesService } from '../../../services/queries/battle-instance-queries.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';

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
export class NewBattleComponent implements OnInit {
  private translateService = inject(TranslateService);
  private destroyRef = inject(DestroyRef);
  private playerService = inject(PlayerService);
  private router = inject(RouterService);
  private websocketEventService = inject(WebsocketEventService);
  private battleInstanceQueriesService = inject(BattleInstanceQueriesService);

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

  public ngOnInit(): void {
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
        takeUntilDestroyed(this.destroyRef),
        filter((player) => !!player),
        first(),
        switchMap((player) => {
          return this.battleInstanceQueriesService.initTrainer(
            player._id,
            this.id
          );
        })
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

  private nextRound(res: BattleStateModel): void {
    if (res.opponent.defeat || res.player.defeat) {
      this.onDefeat();
    }
    this.round += 1;
    const damage = res.damage;
    const isPlayerMoving = damage.attPokemon.trainerId === this.player._id;
    this.roundMessage = [];
    this.pushMessage('ROUND_X', { round: this.round });
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
    this.battleMessage.push(this.roundMessage);
    this.scrollToBottom();
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
          return this.battleInstanceQueriesService.askNextRound(
            player._id,
            this.id
          );
        })
      )
      .subscribe(() => {
        this.activateButtons();
      });
  }

  protected pause(): void {
    this.disableButtons = true;
    this.battleInstanceQueriesService
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
          return this.battleInstanceQueriesService.askNextRoundLoop(
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
          return this.battleInstanceQueriesService.deleteAskNextRound(
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
          return this.battleInstanceQueriesService.deleteAskNextRoundLoop(
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
