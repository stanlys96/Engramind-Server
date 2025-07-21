import { Controller, Post, Get, Param, Body, HttpStatus } from '@nestjs/common';
import { AdvanceRoleplayService } from './advance-roleplay.service';
import { Job, Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { CREATE_ADVANCE_ROLEPLAY_QUEUE } from 'src/utils/constants';
import { CreateAdvanceRoleplayDTO } from './advance-roleplay.dto';

@Controller('advance-roleplay')
export class AdvanceRoleplayController {
  constructor(
    private readonly advanceRoleplayService: AdvanceRoleplayService,
    @InjectQueue(CREATE_ADVANCE_ROLEPLAY_QUEUE)
    private readonly createQuickRoleplayQueue: Queue,
  ) {}

  @Post('create')
  async createAdvanceRoleplay(@Body() data: CreateAdvanceRoleplayDTO) {
    const jobId =
      await this.advanceRoleplayService.performCreateAdvanceRoleplay(data);
    return {
      statusCode: HttpStatus.ACCEPTED,
      message: 'Job enqueued successfully.',
      jobId: jobId,
    };
  }

  @Get('job-status-create/:jobId')
  async getCreateJobStatus(@Param('jobId') jobId: string) {
    const job: Job | undefined =
      await this.createQuickRoleplayQueue.getJob(jobId);
    if (!job) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Job not found.',
      };
    }

    const state = await job.getState();
    const progress = job.progress;
    let result = null;
    let failedReason: any = null;

    if (state === 'completed') {
      result = job.returnvalue;
    } else if (state === 'failed') {
      failedReason = job.failedReason;
    }

    return {
      statusCode: HttpStatus.OK,
      jobId: job.id,
      jobStatus: state,
      progress: progress,
      result: result,
      failedReason: failedReason,
    };
  }
}
