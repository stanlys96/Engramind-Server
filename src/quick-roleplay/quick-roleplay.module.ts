import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { QuickRoleplayController } from './quick-roleplay.controller';
import { CreateQuickRoleplayProcessor } from './create-quick-roleplay.processor';
import { CREATE_QUICK_ROLEPLAY_QUEUE } from 'src/utils/constants';
import { QuickRoleplayService } from './quick-roleplay.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: CREATE_QUICK_ROLEPLAY_QUEUE,
    }),
  ],
  controllers: [QuickRoleplayController],
  providers: [CreateQuickRoleplayProcessor, QuickRoleplayService],
})
export class QuickRoleplayModule {}
