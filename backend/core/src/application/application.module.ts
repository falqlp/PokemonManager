import { Module } from '@nestjs/common';
import { BattleEventsService } from './BattleEvents/BattleEventsService';
import { DomainModule } from '../domain/domain.module';
import ColorService from './color/ColorService';
import { BattleInstanceService } from './battleInstance/BattleInstanceService';
import BattleService from './battle/BattleService';
import { WebsocketModule } from '../websocket/websocket.module';
import BattleCalcService from './battle/BattleCalcService';
import { BattleDataService } from './battle/BattleDataService';
import BattleSideEffectService from './battle/BattleSideEffectService';
import CalendarEventService from './calendarEvent/CalendarEventService';
import SimulateDayService from './calendarEvent/SimulateDayService';
import TrainerService from './trainer/TrainerService';
import NurseryService from './trainer/nursery/NurseryService';
import CompetitionService from './competition/CompetitionService';
import TournamentService from './competition/tournament/TournamentService';
import ExperienceService from './experience/ExperienceService';
import TrainerMapper from '../api/trainer/TrainerMapper';
import PokemonService from './pokemon/PokemonService';
import { NewSeasonService } from './calendarEvent/NewSeasonService';
import { PcStorageService } from './trainer/pcStorage/PcStorageService';
import PokemonUtilsService from './pokemon/PokemonUtilsService';
import PokemonBaseService from './pokemon/pokemonBase/PokemonBaseService';
import MoveLearningService from './moveLearning/MoveLearningService';
import GenerateCalendarService from './calendarEvent/GenerateCalendarService';
import PokemonMapper from '../api/pokemon/PokemonMapper';
import GameService from './game/GameService';
import { UserService } from './user/UserService';
import { MailService } from './mail/MailService';
import { PasswordRequestService } from './user/passwordRequest/PasswordRequestService';
import { PokedexService } from './pokedex/PokedexService';
import EffectivenessService from './pokemon/EffectivenessService';

@Module({
  imports: [DomainModule, WebsocketModule],
  providers: [
    BattleEventsService,
    ColorService,
    BattleInstanceService,
    BattleService,
    BattleCalcService,
    BattleDataService,
    BattleSideEffectService,
    CalendarEventService,
    SimulateDayService,
    TrainerService,
    NurseryService,
    CompetitionService,
    TournamentService,
    ExperienceService,
    TrainerMapper,
    PokemonService,
    NewSeasonService,
    PcStorageService,
    PokemonUtilsService,
    PokemonBaseService,
    MoveLearningService,
    GenerateCalendarService,
    PokemonMapper,
    GameService,
    UserService,
    MailService,
    PokedexService,
    EffectivenessService,
    PasswordRequestService,
  ],
  exports: [
    BattleEventsService,
    ColorService,
    BattleInstanceService,
    BattleService,
    CalendarEventService,
    SimulateDayService,
    GameService,
    UserService,
    MailService,
    MoveLearningService,
    NurseryService,
    PasswordRequestService,
    PokedexService,
    EffectivenessService,
    PokemonService,
    TrainerService,
  ],
})
export class ApplicationModule {}
