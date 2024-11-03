import { Module } from '@nestjs/common';
import CalendarEventRepository from './calendarEvent/CalendarEventRepository';
import BattleInstanceRepository from './battleInstance/BattleInstanceRepository';
import DamageEventRepository from './battleevents/damageevent/DamageEventRepository';
import BattleParticipationEventRepository from './battleevents/battleparticipationevent/BattleParticipationEventRepository';
import PokemonRepository from './pokemon/PokemonRepository';
import TrainerRepository from './trainer/TrainerRepository';
import CalendarEventPopulater from './calendarEvent/CalendarEventPopulater';
import { BattleInstancePopulater } from './battleInstance/BattleInstancePopulater';
import TrainerPopulater from './trainer/TrainerPopulater';
import PokemonPopulater from './pokemon/PokemonPopulater';
import PcStoragePopulater from './trainer/pcStorage/PcStoragePopulater';
import NurseryPopulater from './trainer/nursery/NurseryPopulater';
import TrainingCampPopulater from './trainer/trainingCamp/TrainingCampPopulater';
import { EmptyPopulater } from 'shared/common/domain/EmptyPopulater';
import BattleEventQueriesUtilService from './battleevents/BattleEventQueriesUtilService';
import BattleSerieRepository from './competiton/tournament/battleSerie/BattleSerieRepository';
import GameRepository from './game/GameRepository';
import TournamentRepository from './competiton/tournament/TournamentRepository';
import CompetitionRepository from './competiton/CompetitionRepository';
import BattleSeriePopulater from './competiton/tournament/battleSerie/BattleSeriePopulater';
import GamePopulater from './game/GamePopulater';
import TournamentPopulater from './competiton/tournament/TournamentPopulater';
import CompetitionPopulater from './competiton/CompetitionPopulater';
import NurseryRepository from './trainer/nursery/NurseryRepository';
import TrainerClassRepository from './trainer/trainerClass/TrainerClassRepository';
import EvolutionRepository from './evolution/EvolutionRepository';
import PokemonBaseRepository from './pokemon/pokemonBase/PokemonBaseRepository';
import TrainingCampRepository from './trainer/trainingCamp/TrainingCampRepository';
import PcStorageRepository from './trainer/pcStorage/PcStorageRepository';
import CompetitionHistoryRepository from './competiton/competitionHistory/CompetitionHistoryRepository';
import CompetitionHistoryPopulater from './competiton/competitionHistory/CompetitionHistoryPopulater';
import MoveLearningRepository from './moveLearning/MoveLearningRepository';
import MoveRepository from './move/MoveRepository';
import UserRepository from './user/UserRepository';
import HashService from '../application/user/hash/HashService';
import UserPopulater from './user/UserPopulater';
import { PasswordRequestRepository } from './user/passwordRequest/PasswordRequestRepository';
import { PasswordRequestPopulater } from './user/passwordRequest/PasswordRequestPopulater';
import { MongooseModule } from '@nestjs/mongoose';
import { SchemaModule } from './schema.module';
import { WebsocketUtilsModule } from '../websocket/websocket-utils.module';

@Module({
  imports: [MongooseModule, SchemaModule, WebsocketUtilsModule],
  providers: [
    BattleEventQueriesUtilService,
    BattleInstancePopulater,
    BattleInstanceRepository,
    BattleParticipationEventRepository,
    BattleSeriePopulater,
    BattleSerieRepository,
    CalendarEventPopulater,
    CalendarEventRepository,
    CompetitionPopulater,
    CompetitionRepository,
    DamageEventRepository,
    EmptyPopulater,
    EvolutionRepository,
    GamePopulater,
    GameRepository,
    NurseryPopulater,
    NurseryRepository,
    PcStorageRepository,
    PcStoragePopulater,
    PokemonBaseRepository,
    PokemonPopulater,
    PokemonRepository,
    TournamentPopulater,
    TournamentRepository,
    TrainerClassRepository,
    TrainerPopulater,
    TrainerRepository,
    TrainingCampPopulater,
    TrainingCampRepository,
    CompetitionHistoryRepository,
    CompetitionHistoryPopulater,
    MoveLearningRepository,
    MoveRepository,
    UserRepository,
    HashService,
    UserPopulater,
    PasswordRequestRepository,
    PasswordRequestPopulater,
  ],
  exports: [
    CalendarEventRepository,
    BattleInstanceRepository,
    DamageEventRepository,
    BattleParticipationEventRepository,
    PokemonRepository,
    TrainerRepository,
    BattleSerieRepository,
    GameRepository,
    TournamentRepository,
    CompetitionRepository,
    NurseryRepository,
    TrainerClassRepository,
    TrainingCampRepository,
    PcStorageRepository,
    EvolutionRepository,
    PokemonBaseRepository,
    MoveLearningRepository,
    MoveRepository,
    UserRepository,
    CompetitionHistoryRepository,
    HashService,
    PasswordRequestRepository,
  ],
})
export class DomainModule {}
