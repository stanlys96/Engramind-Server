import { Controller, Post, Get, Param, Body, HttpStatus } from '@nestjs/common';
import { PersonaService } from './persona.service';
import { Job, Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import {
  CREATE_PERSONA_QUEUE,
  UPDATE_PERSONA_QUEUE,
} from 'src/utils/constants';
import { CreatePersonaDTO, UpdatePersonaDTO } from './persona.dto';

@Controller('persona')
export class PersonaController {
  constructor(
    private readonly personaService: PersonaService,
    @InjectQueue(CREATE_PERSONA_QUEUE)
    private readonly createPersonaQueue: Queue,
    @InjectQueue(UPDATE_PERSONA_QUEUE)
    private readonly updatePersonaQueue: Queue,
  ) {}

  @Get('all/:principal')
  async getAllPersonas(@Param('principal') principal: string) {
    return await this.personaService.getAllPersonas(principal);
  }

  @Post('create')
  async createPersona(@Body() data: CreatePersonaDTO) {
    const jobId = await this.personaService.performCreatePersona(data);
    return {
      statusCode: HttpStatus.ACCEPTED,
      message: 'Job enqueued successfully.',
      jobId: jobId,
    };
  }

  @Post('update')
  async updatePersona(@Body() data: UpdatePersonaDTO) {
    const jobId = await this.personaService.performUpdatePersona(data);
    return {
      statusCode: HttpStatus.ACCEPTED,
      message: 'Job enqueued successfully.',
      jobId: jobId,
    };
  }

  @Get('job-status-create/:jobId')
  async getCreateJobStatus(@Param('jobId') jobId: string) {
    const job: Job | undefined = await this.createPersonaQueue.getJob(jobId);
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
    const job: Job | undefined = await this.updatePersonaQueue.getJob(jobId);
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
