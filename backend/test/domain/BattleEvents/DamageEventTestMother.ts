import { IDamageEvent } from "../../../domain/battleevents/damageevent/DamageEvent";

export class DamageEventTestMother {
  static basicDamage(): IDamageEvent {
    return {
      battleId: "battleId",
      value: 50,
      ko: false,
      critical: true,
      missed: false,
      effectiveness: "EFFECTIVE",
      pokemonId: "pokemonId",
      trainerId: "trainerId",
      onPokemonId: "onPokemonId",
      onTrainerId: "onTrainerId",
      moveId: "moveId",
      date: new Date(0),
      competitionId: "competitionId",
    };
  }

  static withCustomOptions(options: Partial<IDamageEvent>): IDamageEvent {
    return {
      ...this.basicDamage(),
      ...options,
    } as IDamageEvent;
  }
}
