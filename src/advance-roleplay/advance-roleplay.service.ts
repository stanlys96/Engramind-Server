import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import {
  CREATE_ADVANCE_ROLEPLAY_JOB,
  CREATE_ADVANCE_ROLEPLAY_QUEUE,
} from 'src/utils/constants';
import { CreateAdvanceRoleplayDTO } from './advance-roleplay.dto';

@Injectable()
export class AdvanceRoleplayService {
  constructor(
    @InjectQueue(CREATE_ADVANCE_ROLEPLAY_QUEUE)
    private readonly createAdvanceRoleplayQueue: Queue<CreateAdvanceRoleplayDTO>,
  ) {}

  async performCreateAdvanceRoleplay(
    data: CreateAdvanceRoleplayDTO,
  ): Promise<string> {
    const job = await this.createAdvanceRoleplayQueue.add(
      CREATE_ADVANCE_ROLEPLAY_JOB,
      data,
      {
        attempts: 1,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: false,
        removeOnFail: false,
      },
    );
    return job.id!;
  }
}
