// src/long-task/long-task.processor.ts
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { CREATE_RUBRICS_QUEUE } from 'src/utils/constants';
import { axiosElwyn } from 'src/utils/axios';
import { CreateRubricsDTO } from './rubrics.dto';
import { extractAndParseRubricJSON } from './rubrics.helper';
import { RubricsResponse } from './rubrics.interface';

interface CreateRubricsJobsResult {
  jobStatus: string;
  message: string;
  processedId: string;
}

@Processor(CREATE_RUBRICS_QUEUE)
export class CreateRubricsProcessor extends WorkerHost {
  async process(
    job: Job<CreateRubricsDTO, CreateRubricsJobsResult, string>,
  ): Promise<CreateRubricsJobsResult> {
    const { id, data } = job;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30 * 1000);
      await job.updateProgress(10);
      try {
        const response = await axiosElwyn.post(
          '/assessment/live/rubrics/create',
          {
            name: data.name,
            rubrics_description: data.description,
            organization_id: data.organization_id,
            file_ids: data.file_ids,
          },
          {
            signal: controller.signal,
          },
        );
        const result = response.data as RubricsResponse;
        const raw = result?.data?.final_rubric;
        const finalRubricParsed = extractAndParseRubricJSON(raw);
        const finalResult = {
          assessment: {
            ...result.data.assessment,
            rubrics: { ...finalRubricParsed },
          },
          name: result?.data?.assessment?.name?.replace(
            'Assessment for Rubric: ',
            '',
          ),
        };
        const apiResponse: CreateRubricsJobsResult = {
          jobStatus: 'success',
          message: 'Data processed successfully by external service!',
          processedId: `proc-${id}-${Date.now()}`,
          ...finalResult,
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
