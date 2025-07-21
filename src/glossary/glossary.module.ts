import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { GlossaryController } from './glossary.controller';
import { CreateGlossaryProcessor } from './create-glossary.processor';
import {
  CREATE_GLOSSARY_QUEUE,
  UPDATE_GLOSSARY_QUEUE,
} from 'src/utils/constants';
import { GlossaryService } from './glossary.service';
import { UpdateGlossaryProcessor } from './update-glossary.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: CREATE_GLOSSARY_QUEUE,
    }),
    BullModule.registerQueue({
      name: UPDATE_GLOSSARY_QUEUE,
    }),
  ],
  controllers: [GlossaryController],
  providers: [
    CreateGlossaryProcessor,
    GlossaryService,
    UpdateGlossaryProcessor,
  ],
})
export class GlossaryModule {}
