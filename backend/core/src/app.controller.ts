import { Controller } from '@nestjs/common';
import { SharedAppController } from 'shared/common';

@Controller('core-app')
export class AppController extends SharedAppController {}
