import { Module } from '@nestjs/common';
import { BattleEventsController } from './battle-event/battle-events.controller';
import { BattleInstanceController } from './battle-instance/battle-instance.controller';
import { CalendarEventController } from './calendar-event/calendar-event.controller';
import { CompetitionController } from './competition/competition.controller';
import { CompetitionHistoryController } from './competitionHistory/competition-history.controller';
import { GameController } from './game/game.controller';
import { LoginController } from './login/login.controller';
import { EmailController } from './mail/email.controller';
import { MoveController } from './move/move.controller';
import { MoveLearningController } from './moveLearning/move-learning.controller';
import { NurseryController } from './nursery/nursery.controller';
import { PasswordRequestController } from './passwordRequest/password-request.controller';
import { PcStorageController } from './pcStorage/pc-storage.controller';
import { PokedexController } from './pokedex/pokedex.controller';
import { PokemonController } from './pokemon/pokemon.controller';
import { PokemonBaseController } from './pokemonBase/pokemon-base.controller';
import { TrainerController } from './trainer/trainer.controller';
import { UserController } from './user/user.controller';
import { ApplicationModule } from '../application/application.module';
import PokemonMapper from './pokemon/PokemonMapper';
import { DomainModule } from '../domain/domain.module';
import BattleInstanceMapper from './battle-instance/BattleInstanceMapper';
import TrainerMapper from './trainer/TrainerMapper';
import CalendarEventMapper from './calendar-event/CalendarEventMapper';
import CompetitionMapper from './competition/CompetitionMapper';
import GameMapper from './game/GameMapper';
import NurseryMapper from './nursery/NurseryMapper';
import UserMapper from './user/UserMapper';
import PcStorageMapper from './pcStorage/PcStorageMapper';

@Module({
  imports: [ApplicationModule, DomainModule],
  providers: [
    PokemonMapper,
    BattleInstanceMapper,
    TrainerMapper,
    CalendarEventMapper,
    CompetitionMapper,
    GameMapper,
    NurseryMapper,
    UserMapper,
    PcStorageMapper,
  ],
  controllers: [
    BattleEventsController,
    BattleInstanceController,
    CalendarEventController,
    CompetitionController,
    CompetitionHistoryController,
    GameController,
    LoginController,
    EmailController,
    MoveController,
    MoveLearningController,
    NurseryController,
    PasswordRequestController,
    PcStorageController,
    PokedexController,
    PokemonController,
    PokemonBaseController,
    TrainerController,
    UserController,
  ],
})
export class ApiModule {}
