import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { PersonaController } from './persona.controller';
import { CreatePersonaProcessor } from './create-persona.processor';
import {
  CREATE_PERSONA_QUEUE,
  UPDATE_PERSONA_QUEUE,
} from 'src/utils/constants';
import { PersonaService } from './persona.service';
import { UpdatePersonaProcessor } from './update-persona.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: CREATE_PERSONA_QUEUE,
    }),
    BullModule.registerQueue({
      name: UPDATE_PERSONA_QUEUE,
    }),
  ],
  controllers: [PersonaController],
  providers: [CreatePersonaProcessor, PersonaService, UpdatePersonaProcessor],
})
export class PersonaModule {}
