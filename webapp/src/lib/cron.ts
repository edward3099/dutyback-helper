import cron from 'node-cron';
import { policyMonitor } from './policy-monitor';

export class CronService {
  private jobs: Map<string, cron.ScheduledTask> = new Map();

  /**
   * Start all scheduled jobs
   */
  startAllJobs(): void {
    console.log('Starting cron jobs...');

    // Policy monitoring job - runs every hour
    this.startJob('policy-monitor', '0 * * * *', async () => {
      console.log('Running policy monitoring job...');
      try {
        await policyMonitor.checkAllPolicies();
        console.log('Policy monitoring job completed');
      } catch (error) {
        console.error('Policy monitoring job failed:', error);
      }
    });

    // Daily cleanup job - runs at 2 AM
    this.startJob('daily-cleanup', '0 2 * * *', async () => {
      console.log('Running daily cleanup job...');
      try {
        await this.cleanupOldData();
        console.log('Daily cleanup job completed');
      } catch (error) {
        console.error('Daily cleanup job failed:', error);
      }
    });

    console.log('All cron jobs started');
  }

  /**
   * Stop all scheduled jobs
   */
  stopAllJobs(): void {
    console.log('Stopping all cron jobs...');
    this.jobs.forEach((job, name) => {
      job.stop();
      console.log(`Stopped job: ${name}`);
    });
    this.jobs.clear();
    console.log('All cron jobs stopped');
  }

  /**
   * Start a specific job
   */
  private startJob(name: string, schedule: string, task: () => Promise<void>): void {
    if (this.jobs.has(name)) {
      console.log(`Job ${name} already exists, stopping it first`);
      this.jobs.get(name)?.stop();
    }

    const job = cron.schedule(schedule, task, {
      scheduled: false,
      timezone: 'Europe/London'
    });

    job.start();
    this.jobs.set(name, job);
    console.log(`Started job: ${name} with schedule: ${schedule}`);
  }

  /**
   * Stop a specific job
   */
  stopJob(name: string): void {
    const job = this.jobs.get(name);
    if (job) {
      job.stop();
      this.jobs.delete(name);
      console.log(`Stopped job: ${name}`);
    } else {
      console.log(`Job ${name} not found`);
    }
  }

  /**
   * Get status of all jobs
   */
  getJobStatus(): { name: string; running: boolean; schedule: string }[] {
    return Array.from(this.jobs.entries()).map(([name, job]) => ({
      name,
      running: job.running,
      schedule: job.options.scheduled ? 'active' : 'inactive'
    }));
  }

  /**
   * Cleanup old data
   */
  private async cleanupOldData(): Promise<void> {
    // This would clean up old policy changes, logs, etc.
    // For now, just log that cleanup would happen
    console.log('Daily cleanup would run here - cleaning old data');
  }
}

// Export singleton instance
export const cronService = new CronService();

// Auto-start jobs in production
if (process.env.NODE_ENV === 'production') {
  cronService.startAllJobs();
}
