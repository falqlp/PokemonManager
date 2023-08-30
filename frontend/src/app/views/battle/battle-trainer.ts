import { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import { MoveModel } from '../../models/move.model';
import { DecisionModel, TrainerAutorizationsModel } from './battle.model';
import { TrainerModel } from '../../models/TrainersModels/trainer.model';
import { BattleService } from './battle.service';
import { BattleComponent } from './battle.component';
import { DamageModel } from '../../models/damage.model';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ROUND_TIME_MS } from './battel.const';
import { BattleQueriesService } from './battle-queries.service';

export class BattleTrainer {
  protected decisionSubject = new BehaviorSubject<DecisionModel>({
    pokemon: undefined,
    move: undefined,
  });

  public decision$ = this.decisionSubject.asObservable();
  public _id: string;
  public name: string;
  public pokemons: PokemonModel[];
  public selectedMove: MoveModel;
  public autorizations: TrainerAutorizationsModel = {
    canChangeMove: true,
    moveCooldown: 0,
    canChangePokemon: true,
    pokemonCooldown: 0,
  };

  public damage: DamageModel;
  public aiDecision: DecisionModel;

  public constructor(
    trainer: TrainerModel,
    protected isAI: boolean,
    protected service: BattleService,
    protected battle: BattleComponent,
    protected battleQueriesService: BattleQueriesService
  ) {
    this.init(trainer);
  }

  protected init(trainer: TrainerModel): void {
    this.name = trainer.name;
    this._id = trainer.name;
    this.pokemons = trainer.pokemons;
    if (this.isAI) {
      this.susbcribeAiDecision();
    }
  }

  public onMoveChange(newMove: MoveModel): void {
    if (this.autorizations.canChangeMove) {
      if (this.battle.started) {
        this.setMoveCooldown(this.pokemons[0]);
      }
      this.selectedMove = newMove;
      this.battle.updateAiOpponent(this);
    }
  }

  public setMoveCooldown(pokemon: PokemonModel): void {
    this.autorizations.canChangeMove = false;
    this.autorizations.moveCooldown = 100;
    const interval = setInterval(() => {
      this.autorizations.moveCooldown -= 1;
      if (
        this.autorizations.moveCooldown <= 0 ||
        this.pokemons[0].currentHp === 0
      ) {
        clearInterval(interval);
        this.autorizations.canChangeMove = true;
        this.autorizations.moveCooldown = 0;
        if (
          this.isAI &&
          this.selectedMove?.name !== this.aiDecision.move.name
        ) {
          this.onMoveChange(this.aiDecision.move);
        }
      }
    }, this.service.getCooldownMs(pokemon));
  }

  public changeActivePokemon(pokemon: PokemonModel): void {
    if (this.autorizations.canChangePokemon && this.battle.started) {
      if (this.pokemons[0].currentHp !== 0) {
        this.setPokemonCooldown(pokemon);
        this.setMoveCooldown(pokemon);
      }
      this.changePokemon(pokemon);
      this.selectedMove = undefined;
      this.battle.updateAiOpponent(this);
    }
  }

  public changePokemon(pokemon: PokemonModel): void {
    const oldPokemon = this.pokemons[0];
    this.pokemons[
      this.pokemons.findIndex(
        (playerPokemon) => playerPokemon?._id === pokemon?._id
      )
    ] = this.pokemons[0];
    this.pokemons[0] = pokemon;
    if (pokemon.trainerId === '6496f985f15bc10f660c1958') {
      console.log(oldPokemon, pokemon);
    }
  }

  public setPokemonCooldown(pokemon: PokemonModel): void {
    this.autorizations.canChangePokemon = false;
    this.autorizations.pokemonCooldown = 100;
    const interval = setInterval(() => {
      this.autorizations.pokemonCooldown -= 1;
      if (
        this.autorizations.pokemonCooldown <= 0 ||
        this.pokemons[0].currentHp === 0
      ) {
        clearInterval(interval);
        this.autorizations.canChangePokemon = true;
        this.autorizations.pokemonCooldown = 0;
        if (this.pokemons[0]._id !== this.aiDecision.pokemon._id) {
          this.changeActivePokemon(this.aiDecision.pokemon);
        }
      }
    }, this.service.getCooldownMs(pokemon));
  }

  public pokemonKO(): void {
    if (this.pokemons.some((pokemon) => pokemon.currentHp !== 0)) {
      this.battle.updateAiOpponent(this, true);
    } else {
      this.battle.onDefeat(this);
    }
  }

  protected susbcribeAiDecision(): void {
    this.decision$.subscribe((decision) => {
      if (decision.move && decision.pokemon) {
        this.aiDecision = decision;
        if (decision.pokemon._id !== this.pokemons[0]._id) {
          this.changeActivePokemon(decision.pokemon);
        }
        if (decision.move.name !== this.selectedMove?.name) {
          this.onMoveChange(decision.move);
        }
      }
    });
  }

  public update(
    opponentPokemon: PokemonModel,
    selectedMove: MoveModel,
    pokemons: PokemonModel[]
  ): Observable<DecisionModel> {
    return this.decisionMaking(opponentPokemon, selectedMove, pokemons);
  }

  protected decisionMaking(
    opponentPokemon: PokemonModel,
    selectedMove: MoveModel,
    pokemons: PokemonModel[]
  ): Observable<DecisionModel> {
    return this.battleQueriesService
      .decisionMaking(opponentPokemon, selectedMove, pokemons)
      .pipe(
        tap((decision) => {
          setTimeout(() => {
            this.decisionSubject.next(decision);
          }, 4 * ROUND_TIME_MS);
        })
      );
  }
}
