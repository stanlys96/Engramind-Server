// src/long-task/long-task-producer.service.ts
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { CREATE_RUBRICS_JOB, CREATE_RUBRICS_QUEUE } from 'src/utils/constants';
import { CreateRubricsDTO } from './rubrics.dto';
import { axiosElwyn } from 'src/utils/axios';
import { AssessmentRaw } from './rubrics.interface';
import { extractAndParseRubricJSON } from './rubrics.helper';

@Injectable()
export class RubricsService {
  constructor(
    @InjectQueue(CREATE_RUBRICS_QUEUE)
    private readonly createRubricsQueue: Queue<CreateRubricsDTO>,
  ) {}

  async getAllRubrics(principal: string) {
    const response = await axiosElwyn.get(`/assessment/rubrics`);
    return response?.data?.data
      ?.filter(
        (rubrics: AssessmentRaw) => rubrics.organization_id === principal,
      )
      ?.map((rubricsData: AssessmentRaw) => {
        return {
          ...rubricsData,
          rubrics: extractAndParseRubricJSON(rubricsData?.rubrics),
        };
      })
      .sort((a: any, b: any) => {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return dateB - dateA;
      });
  }

  async performCreateRubrics(data: CreateRubricsDTO): Promise<string> {
    const job = await this.createRubricsQueue.add(CREATE_RUBRICS_JOB, data, {
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
