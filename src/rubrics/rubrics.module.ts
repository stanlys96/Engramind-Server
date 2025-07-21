import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { CreateRubricsProcessor } from './create-rubrics.processor';
import { CREATE_RUBRICS_QUEUE } from 'src/utils/constants';
import { RubricsService } from './rubrics.service';
import { RubricsController } from './rubrics.controller';

@Module({
  imports: [
    BullModule.registerQueue({
      name: CREATE_RUBRICS_QUEUE,
    }),
  ],
  controllers: [RubricsController],
  providers: [CreateRubricsProcessor, RubricsService],
})
export class RubricsModule {}
