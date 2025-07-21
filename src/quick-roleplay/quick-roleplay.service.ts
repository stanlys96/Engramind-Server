import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import {
  CREATE_QUICK_ROLEPLAY_JOB,
  CREATE_QUICK_ROLEPLAY_QUEUE,
} from 'src/utils/constants';
import { CreateQuickRoleplayDTO } from './quick-roleplay.dto';
import { axiosElwyn } from 'src/utils/axios';
import { RoleplayResponseRaw } from './quick-roleplay.interface';

@Injectable()
export class QuickRoleplayService {
  constructor(
    @InjectQueue(CREATE_QUICK_ROLEPLAY_QUEUE)
    private readonly createQuickRoleplayQueue: Queue<CreateQuickRoleplayDTO>,
  ) {}

  async getAllRoleplays(principal: string) {
    const response = await axiosElwyn.get(
      `/assessment/scenarios/organization/all?organization_id=${principal}`,
    );
    return response?.data?.data
      ?.map((result: RoleplayResponseRaw) => ({
        ...result,
        description: JSON.parse(result?.description),
      }))
      ?.sort((a: any, b: any) => {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return dateB - dateA;
      });
  }

  async performCreateQuickRoleplay(
    data: CreateQuickRoleplayDTO,
  ): Promise<string> {
    const job = await this.createQuickRoleplayQueue.add(
      CREATE_QUICK_ROLEPLAY_JOB,
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
