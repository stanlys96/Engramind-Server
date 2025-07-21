import { Controller, Post, Get, Param, Body, HttpStatus } from '@nestjs/common';
import { RubricsService } from './rubrics.service';
import { Job, Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { CREATE_RUBRICS_QUEUE } from 'src/utils/constants';
import { CreateRubricsDTO } from './rubrics.dto';

@Controller('rubrics')
export class RubricsController {
  constructor(
    private readonly rubricsService: RubricsService,
    @InjectQueue(CREATE_RUBRICS_QUEUE)
    private readonly createRubricsQueue: Queue,
  ) {}

  @Get('all/:principal')
  async getAllRubrics(@Param('principal') principal: string) {
    return await this.rubricsService.getAllRubrics(principal);
  }

  @Post('create')
  async createRubrics(@Body() data: CreateRubricsDTO) {
    const jobId = await this.rubricsService.performCreateRubrics(data);
    return {
      statusCode: HttpStatus.ACCEPTED,
      message: 'Job enqueued successfully.',
      jobId: jobId,
    };
  }

  @Get('job-status-create/:jobId')
  async getCreateJobStatus(@Param('jobId') jobId: string) {
    const job: Job | undefined = await this.createRubricsQueue.getJob(jobId);
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
