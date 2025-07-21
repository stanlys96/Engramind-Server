// src/long-task/long-task-producer.service.ts
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import {
  CREATE_GLOSSARY_QUEUE,
  CREATE_GLOSSARY_JOB,
  UPDATE_GLOSSARY_QUEUE,
  UPDATE_GLOSSARY_JOB,
} from 'src/utils/constants';
import { CreateOrUpdateGlossaryDTO } from './glossary.dto';
import { axiosElwyn } from 'src/utils/axios';
import { GlossaryData } from './glossary.interface';

@Injectable()
export class GlossaryService {
  constructor(
    @InjectQueue(CREATE_GLOSSARY_QUEUE)
    private readonly createGlossaryQueue: Queue<CreateOrUpdateGlossaryDTO>,
    @InjectQueue(UPDATE_GLOSSARY_QUEUE)
    private readonly updateGlossaryQueue: Queue<CreateOrUpdateGlossaryDTO>,
  ) {}

  async getAllGlossaries(principal: string) {
    const response = await axiosElwyn.get(`/assessment/scenario-glossary`);
    return response?.data?.data
      ?.filter(
        (glossary: GlossaryData) => glossary.organization_id === principal,
      )
      ?.sort((a: any, b: any) => {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return dateB - dateA;
      });
  }

  async performCreateGlossary(
    data: CreateOrUpdateGlossaryDTO,
  ): Promise<string> {
    const job = await this.createGlossaryQueue.add(CREATE_GLOSSARY_JOB, data, {
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

  async performUpdateGlossary(
    data: CreateOrUpdateGlossaryDTO,
  ): Promise<string> {
    const job = await this.updateGlossaryQueue.add(UPDATE_GLOSSARY_JOB, data, {
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
