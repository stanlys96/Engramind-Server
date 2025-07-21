// src/long-task/long-task-producer.service.ts
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import {
  CREATE_PERSONA_JOB,
  CREATE_PERSONA_QUEUE,
  UPDATE_PERSONA_JOB,
  UPDATE_PERSONA_QUEUE,
} from 'src/utils/constants';
import { CreatePersonaDTO, UpdatePersonaDTO } from './persona.dto';
import { axiosElwyn } from 'src/utils/axios';
import { PersonaData } from './persona.interface';

@Injectable()
export class PersonaService {
  constructor(
    @InjectQueue(CREATE_PERSONA_QUEUE)
    private readonly createPersonaQueue: Queue<CreatePersonaDTO>,
    @InjectQueue(UPDATE_PERSONA_QUEUE)
    private readonly updatePersonaQueue: Queue<UpdatePersonaDTO>,
  ) {}

  async getAllPersonas(principal: string) {
    const response = await axiosElwyn.get(`/assessment/persona-characters`);
    return response?.data?.data
      ?.filter((persona: PersonaData) => persona?.organization_id === principal)
      ?.sort((a: any, b: any) => {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return dateB - dateA;
      });
  }

  async performCreatePersona(data: CreatePersonaDTO): Promise<string> {
    const job = await this.createPersonaQueue.add(CREATE_PERSONA_JOB, data, {
      attempts: 1,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
      removeOnComplete: false,
      removeOnFail: false,
    });
    return job.id!;
  }

  async performUpdatePersona(data: UpdatePersonaDTO): Promise<string> {
    const job = await this.updatePersonaQueue.add(UPDATE_PERSONA_JOB, data, {
      attempts: 1,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
      removeOnComplete: false,
      removeOnFail: false,
    });
    return job.id!;
  }
}
