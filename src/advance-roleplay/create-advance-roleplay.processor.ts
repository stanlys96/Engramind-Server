import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { CREATE_ADVANCE_ROLEPLAY_QUEUE } from 'src/utils/constants';
import { axiosElwyn } from 'src/utils/axios';
import { CreateAdvanceRoleplayDTO } from './advance-roleplay.dto';

interface AdvanceRoleplayJobResult {
  jobStatus: string;
  message: string;
  processedId: string;
}

@Processor(CREATE_ADVANCE_ROLEPLAY_QUEUE)
export class CreateAdvanceRoleplayProcessor extends WorkerHost {
  async process(
    job: Job<CreateAdvanceRoleplayDTO, AdvanceRoleplayJobResult, string>,
  ): Promise<AdvanceRoleplayJobResult> {
    const { id, data } = job;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 120 * 1000);
      await job.updateProgress(10);
      try {
        const response = await axiosElwyn.post(
          '/assessment/live/scenarios/create',
          {
            scenario_title: data.scenario_title,
            persona_id: data.persona_id,
            rubric_id: data.rubric_id,
            scenario_description: data.scenario_description,
            organization_id: data.organization_id,
            file_ids: data.file_ids,
          },
          {
            signal: controller.signal,
          },
        );

        const apiResponse: AdvanceRoleplayJobResult = {
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
