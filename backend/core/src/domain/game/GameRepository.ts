import CompleteRepository from 'shared/common/domain/CompleteRepository';
import Game, { IGame } from './Game';
import { Injectable } from '@nestjs/common';
import GamePopulater from './GamePopulater';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
class GameRepository extends CompleteRepository<IGame> {
  constructor(
    gamePopulater: GamePopulater,
    @InjectModel(Game.modelName)
    protected override readonly schema: Model<IGame>,
  ) {
    super(schema, gamePopulater);
  }

  public async updatePlayingTime(
    gameId: string,
    trainerId: string,
    sessionTime: number,
  ): Promise<IGame> {
    if (sessionTime) {
      const game = await this.get(gameId);
      if (game?.players) {
        const player = game.players.find(
          (player) => player.trainer?._id.toString() === trainerId,
        );
        player.playingTime += sessionTime;
      }
      return await this.update(game._id, game);
    }
  }
}

export default GameRepository;
