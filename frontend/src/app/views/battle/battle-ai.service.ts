import { PokemonModel } from '../../models/PokemonModels/pokemon.model';
import { MoveModel } from '../../models/move.model';
import { DecisionModel } from './battle.model';
import { BattleService } from './battle.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ROUND_TIME_MS } from './battel.const';
import { BattleQueriesService } from './battle-queries.service';

export class BattleAiService {
  protected decisionSubject = new BehaviorSubject<DecisionModel>({
    pokemon: undefined,
    move: undefined,
  });

  public decision$ = this.decisionSubject.asObservable();
  public constructor(protected battleQueriesService: BattleQueriesService) {}

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
