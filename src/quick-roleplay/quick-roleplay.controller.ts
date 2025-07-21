import { Controller, Post, Get, Param, Body, HttpStatus } from '@nestjs/common';
import { QuickRoleplayService } from './quick-roleplay.service';
import { Job, Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { CREATE_QUICK_ROLEPLAY_QUEUE } from 'src/utils/constants';
import { CreateQuickRoleplayDTO } from './quick-roleplay.dto';

@Controller('quick-roleplay')
export class QuickRoleplayController {
  constructor(
    private readonly quickRoleplayService: QuickRoleplayService,
    @InjectQueue(CREATE_QUICK_ROLEPLAY_QUEUE)
    private readonly createQuickRoleplayQueue: Queue,
  ) {}

  @Get('all/:principal')
  async getAllRoleplays(@Param('principal') principal: string) {
    return await this.quickRoleplayService.getAllRoleplays(principal);
  }

  @Post('create')
  async createQuickRoleplay(@Body() data: CreateQuickRoleplayDTO) {
    const jobId =
      await this.quickRoleplayService.performCreateQuickRoleplay(data);
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
