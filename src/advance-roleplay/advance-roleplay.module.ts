import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { AdvanceRoleplayController } from './advance-roleplay.controller';
import { CreateAdvanceRoleplayProcessor } from './create-advance-roleplay.processor';
import { CREATE_ADVANCE_ROLEPLAY_QUEUE } from 'src/utils/constants';
import { AdvanceRoleplayService } from './advance-roleplay.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: CREATE_ADVANCE_ROLEPLAY_QUEUE,
    }),
  ],
  controllers: [AdvanceRoleplayController],
  providers: [CreateAdvanceRoleplayProcessor, AdvanceRoleplayService],
})
export class AdvanceRoleplayModule {}
