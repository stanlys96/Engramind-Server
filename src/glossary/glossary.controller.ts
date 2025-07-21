import { Controller, Post, Get, Param, Body, HttpStatus } from '@nestjs/common';
import { GlossaryService } from './glossary.service';
import { Job, Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import {
  CREATE_GLOSSARY_QUEUE,
  UPDATE_GLOSSARY_QUEUE,
} from 'src/utils/constants';
import { CreateOrUpdateGlossaryDTO } from './glossary.dto';

@Controller('glossary')
export class GlossaryController {
  constructor(
    private readonly glossaryService: GlossaryService,
    @InjectQueue(CREATE_GLOSSARY_QUEUE)
    private readonly createGlossaryQueue: Queue,
    @InjectQueue(UPDATE_GLOSSARY_QUEUE)
    private readonly updateGlossaryQueue: Queue,
  ) {}

  @Get('all/:principal')
  async getAllGlossaries(@Param('principal') principal: string) {
    return await this.glossaryService.getAllGlossaries(principal);
  }

  @Post('create')
  async createGlossary(@Body() data: CreateOrUpdateGlossaryDTO) {
    const jobId = await this.glossaryService.performCreateGlossary(data);
    return {
      statusCode: HttpStatus.ACCEPTED,
      message: 'Job enqueued successfully.',
      jobId: jobId,
    };
  }

  @Post('update')
  async updateGlossary(@Body() data: CreateOrUpdateGlossaryDTO) {
    const jobId = await this.glossaryService.performUpdateGlossary(data);
    return {
      statusCode: HttpStatus.ACCEPTED,
      message: 'Job enqueued successfully.',
      jobId: jobId,
    };
  }

  @Get('job-status-create/:jobId')
  async getCreateJobStatus(@Param('jobId') jobId: string) {
    const job: Job | undefined = await this.createGlossaryQueue.getJob(jobId);
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

  @Get('job-status-update/:jobId')
  async getUpdateJobStatus(@Param('jobId') jobId: string) {
    const job: Job | undefined = await this.updateGlossaryQueue.getJob(jobId);
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
