import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Post,
  Put,
} from '@nestjs/common';
import CalendarEventService from '../../application/calendarEvent/CalendarEventService';
import SimulateDayService from '../../application/calendarEvent/SimulateDayService';
import CalendarEventMapper from './CalendarEventMapper';
import BattleInstanceMapper from '../battle-instance/BattleInstanceMapper';
import { ReadOnlyController } from '../read-only.controller';
import CalendarEventRepository from '../../domain/calendarEvent/CalendarEventRepository';
import { ICalendarEvent } from '../../domain/calendarEvent/CalendarEvent';

@Controller('calendar-event')
export class CalendarEventController extends ReadOnlyController<ICalendarEvent> {
  constructor(
    protected readonly repository: CalendarEventRepository,
    protected readonly mapper: CalendarEventMapper,
    private readonly calendarEventService: CalendarEventService,
    private readonly simulateDayService: SimulateDayService,
    private readonly battleInstanceMapper: BattleInstanceMapper,
  ) {
    super(repository, mapper);
  }

  @Post('battle')
  async createBattleEvent(
    @Body('date') date: Date,
    @Body('trainers') trainers: any,
    @Body('competition') competition: any,
    @Headers('game-id') gameId: string,
  ) {
    try {
      const obj = await this.calendarEventService.createBattleEvent(
        date,
        trainers,
        competition,
        gameId,
      );
      return this.mapper.map(obj);
    } catch (error) {
      throw new HttpException(
        'Failed to create battle event: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('weekCalendar')
  async getWeekCalendar(
    @Body('trainerId') trainerId: string,
    @Body('date') date: Date,
    @Headers('game-id') gameId: string,
  ) {
    try {
      const obj = await this.calendarEventService.getWeekCalendar(
        trainerId,
        date,
        gameId,
      );
      return obj.map((events) => events.map((event) => this.mapper.map(event)));
    } catch (error) {
      throw new HttpException(
        'Failed to fetch week calendar: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('askNextDay')
  async askNextDay(
    @Body('trainerId') trainerId: string,
    @Body('date') date: string,
    @Headers('game-id') gameId: string,
  ) {
    try {
      const obj = await this.simulateDayService.askSimulateDay(
        trainerId,
        gameId,
        new Date(date),
      );
      if (obj.battle) {
        obj.battle = this.battleInstanceMapper.map(obj.battle);
      }
      return obj;
    } catch (error) {
      throw new HttpException(
        'Failed to ask for next day simulation: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('deleteAskNextDay')
  async deleteAskNextDay(
    @Body('trainerId') trainerId: string,
    @Headers('game-id') gameId: string,
  ) {
    try {
      await this.simulateDayService.deleteAskNextDay(trainerId, gameId);
      return { status: 'success' };
    } catch (error) {
      throw new HttpException(
        'Failed to delete ask next day request: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('updateAskNextDay')
  async updateAskNextDay(@Headers('game-id') gameId: string) {
    try {
      await this.simulateDayService.updateAskNextDay(gameId);
      return { status: 'success' };
    } catch (error) {
      throw new HttpException(
        'Failed to update ask next day request: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}