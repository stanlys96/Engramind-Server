// src/long-task/long-task.processor.ts
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { UPDATE_PERSONA_QUEUE } from 'src/utils/constants';
import { axiosElwyn } from 'src/utils/axios';
import { UpdatePersonaDTO } from './persona.dto';
import { handleUpdatePersonaDTO } from './persona.helper';

interface UpdatePersonaJobResult {
  jobStatus: string;
  message: string;
  processedId: string;
}

@Processor(UPDATE_PERSONA_QUEUE)
export class UpdatePersonaProcessor extends WorkerHost {
  async process(
    job: Job<UpdatePersonaDTO, UpdatePersonaJobResult, string>,
  ): Promise<UpdatePersonaJobResult> {
    const { id, data } = job;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60 * 1000);
      await job.updateProgress(10);
      try {
        const response = await axiosElwyn.put(
          `/assessment/persona-characters/${data.id}`,
          handleUpdatePersonaDTO(data),
          {
            signal: controller.signal,
          },
        );

        const apiResponse: UpdatePersonaJobResult = {
          jobStatus: 'success',
          message: 'Data processed successfully by external service!',
          processedId: `proc-${id}-${Date.now()}`,
          ...response.data,
        };

        await job.updateProgress(100);
        return apiResponse;
      } catch (e) {
        throw new Error(
          `External API Service Error for job ${id}: ${e?.message}`,
        );
      } finally {
        clearTimeout(timeout);
      }
    } catch (error) {
      console.error(
        `[Worker] Error during long API call for job ${id}:`,
        error.message,
      );
      throw new Error(
        `External API Service Error for job ${id}: ${error.message}`,
      );
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(
      `[Worker Event] Job ${job.id} completed. Result:`,
      job.returnvalue,
    );
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: Error) {
    console.error(`[Worker Event] Job ${job.id} failed. Error:`, err.message);
  }

  @OnWorkerEvent('error')
  onError(err: Error) {
    console.error('[Worker Event] Worker-level error:', err);
  }
}
