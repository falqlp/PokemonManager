import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import User from './user/User';
import PasswordRequest from './user/passwordRequest/PasswordRequest';
import Trainer from './trainer/Trainer';
import Nursery from './trainer/nursery/Nursery';
import PcStorage from './trainer/pcStorage/PcStorage';
import TrainerClass from './trainer/trainerClass/TrainerClass';
import TrainerName from './trainer/trainerName/TrainerName';
import TrainingCamp from './trainer/trainingCamp/TrainingCamp';
import Pokemon from './pokemon/Pokemon';
import PokemonBase from './pokemon/pokemonBase/PokemonBase';
import MoveLearning from './moveLearning/MoveLearning';
import Move from './move/Move';
import Game from './game/Game';
import Evolution from './evolution/Evolution';
import Competition from './competiton/Competition';
import CompetitionHistory from './competiton/competitionHistory/CompetitionHistory';
import Tournament from './competiton/tournament/Tournament';
import CalendarEvent from './calendarEvent/CalendarEvent';
import Battle from './battleInstance/Battle';
import BattleSerie from './competiton/tournament/battleSerie/BattleSerie';
import { mapSchemas } from 'shared/utils';

@Module({
  imports: [
    MongooseModule.forFeature(
      mapSchemas([
        User,
        PasswordRequest,
        Trainer,
        Nursery,
        PcStorage,
        TrainerClass,
        TrainerName,
        TrainingCamp,
        Pokemon,
        PokemonBase,
        MoveLearning,
        Move,
        Game,
        Evolution,
        Competition,
        CompetitionHistory,
        Tournament,
        CalendarEvent,
        Battle,
        BattleSerie,
      ]),
    ),
  ],
  exports: [MongooseModule],
})
export class SchemaModule {}
