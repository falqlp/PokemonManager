import { singleton } from "tsyringe";
import CalendarEventRepository from "../../domain/calendarEvent/CalendarEventRepository";
import BattleInstanceRepository from "../../domain/battleInstance/BattleInstanceRepository";
import { IDamageEvent } from "../../domain/battleevents/damageevent/DamageEvent";
import { IBattleParticipationEvent } from "../../domain/battleevents/battleparticipationevent/BattleParticipationEvent";
import DamageEventRepository from "../../domain/battleevents/damageevent/DamageEventRepository";
import BattleParticipationEventRepository from "../../domain/battleevents/battleparticipationevent/BattleParticipationEventRepository";
import {
  IDamageEventQuery,
  IStatsByPokemon,
} from "../../domain/battleevents/BattleEventQueriesUtilService";
import { SortOrder } from "mongoose";
import PokemonRepository from "../../domain/pokemon/PokemonRepository";
import TrainerRepository from "../../domain/trainer/TrainerRepository";
import ColorService from "../color/ColorService";

export enum BattleEventQueryType {
  TOTAL_DAMAGE = "TOTAL_DAMAGE",
  TOTAL_DAMAGE_RECEIVED = "TOTAL_DAMAGE_RECEIVED",
  TOTAL_KO = "TOTAL_KO",
  TOTAL_KO_RECEIVED = "TOTAL_KO_RECEIVED",
  BATTLE_PARTICIPATION = "BATTLE_PARTICIPATION",
}

@singleton()
export class BattleEventsService {
  constructor(
    private calendarEventRepository: CalendarEventRepository,
    private battleInstanceRepository: BattleInstanceRepository,
    private damageEventRepository: DamageEventRepository,
    private battleParticipationEventRepository: BattleParticipationEventRepository,
    private pokemonRepository: PokemonRepository,
    private trainerRepository: TrainerRepository,
    private colorService: ColorService,
  ) {}

  public async insertBattleEventsData(
    battleId: string,
    damageEvents: IDamageEvent[],
    battleParticipationEvents: IBattleParticipationEvent[],
  ): Promise<void> {
    const date = await this.calendarEventRepository.getBattleDate(battleId);
    const battle = await this.battleInstanceRepository.get(battleId);
    const competitionId = battle.competition._id.toString();
    const gameId = battle.gameId.toString();
    const division = battle.competition.division;
    damageEvents = damageEvents.map((event) => {
      return {
        ...event,
        battleId,
        competitionId,
        date,
        gameId,
        division,
      };
    });
    battleParticipationEvents = battleParticipationEvents.map((event) => {
      return {
        ...event,
        battleId,
        competitionId,
        date,
        gameId,
        division,
      };
    });
    await this.damageEventRepository.insertMany(damageEvents);
    await this.battleParticipationEventRepository.insertMany(
      battleParticipationEvents,
    );
  }

  public getBattleEventQuery(
    type: BattleEventQueryType,
  ): (
    gameId: string,
    query?: IDamageEventQuery,
    sort?: SortOrder,
  ) => Promise<IStatsByPokemon[]> {
    switch (type) {
      case BattleEventQueryType.TOTAL_DAMAGE:
        return this.damageEventRepository.getTotalDamage.bind(
          this.damageEventRepository,
        );
      case BattleEventQueryType.TOTAL_DAMAGE_RECEIVED:
        return this.damageEventRepository.getTotalDamageReceived.bind(
          this.damageEventRepository,
        );
      case BattleEventQueryType.TOTAL_KO:
        return this.damageEventRepository.getTotalKo.bind(
          this.damageEventRepository,
        );
      case BattleEventQueryType.TOTAL_KO_RECEIVED:
        return this.damageEventRepository.getTotalKoReceived.bind(
          this.damageEventRepository,
        );
      case BattleEventQueryType.BATTLE_PARTICIPATION:
        return this.battleParticipationEventRepository.getPaticipation.bind(
          this.battleParticipationEventRepository,
        );
    }
  }

  public async getBattleEventStats(
    gameId: string,
    type: BattleEventQueryType,
    isRelative: boolean,
    query?: IDamageEventQuery,
    sort?: SortOrder,
  ): Promise<IStatsByPokemon[]> {
    let res = await this.getBattleEventQuery(type)(gameId, query, sort);
    if (isRelative && type !== BattleEventQueryType.BATTLE_PARTICIPATION) {
      res = await this.getRelativeResult(res, gameId, query, sort);
    }
    const pokemons = await this.pokemonRepository.list({
      ids: res.map((stats) => stats._id),
    });
    const trainers = await this.trainerRepository.list({
      ids: pokemons.map((pokemon) => pokemon.trainerId.toString()),
    });
    const result = res.map((el, index) => {
      const trainer = trainers.find(
        (trainer) =>
          trainer._id.toString() === pokemons[index].trainerId.toString(),
      );
      return {
        value: el.value,
        _id: el._id,
        pokemon: pokemons[index],
        trainer: {
          name: trainer.name,
          class: trainer.class,
          _id: trainer._id,
          color: this.colorService.getColorForTrainer(trainer._id.toString()),
        },
      };
    });
    if (
      !result.every(
        (result) => result._id.toString() === result.pokemon._id.toString(),
      )
    ) {
      throw new Error("Pokemons does not match");
    }
    return result;
  }

  public async getRelativeResult(
    res: IStatsByPokemon[],
    gameId: string,
    query?: IDamageEventQuery,
    sort?: SortOrder,
  ): Promise<IStatsByPokemon[]> {
    const isRelativeRes =
      await this.battleParticipationEventRepository.getPaticipation(
        gameId,
        query,
        sort,
      );
    res = isRelativeRes
      .map((participation) => {
        const newValue =
          res.find((result) => result._id === participation._id)?.value /
          participation.value;
        return {
          _id: participation._id,
          value: isNaN(newValue) ? 0 : newValue,
        };
      })
      .sort((a, b) => {
        if (sort === -1) {
          return b.value - a.value;
        }
        return a.value - b.value;
      });
    return res;
  }
}
