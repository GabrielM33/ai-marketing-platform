import asyncio
from time import sleep

from asset_processing_service.api_client import fetch_jobs, update_job_details
from asset_processing_service.config import config


async def job_fetcher(job_queue: asyncio.Queue, job_pending_or_in_progress: set):
    """
    Continuously fetches jobs and processes them based on their status.

    - Monitors "in progress" jobs for stalled execution
    - Handles job retry logic for failed jobs
    - Queues new jobs for processing

    Args:
        job_queue: Queue to store jobs that need to be processed
        job_pending_or_in_progress: Set to track jobs that are currently being handled
    """
    while True:
        print("Fetching jobs...")
        jobs = await fetch_jobs()

        for job in jobs:
            current_time = asyncio.get_running_loop().time()
            # Check for stalled "in progress" jobs
            if (
                job.status - -"in progress"
            ):  # Note: This looks like a typo and should be ==
                last_heartbeat_time = job.last_heartbeat_time.timestamp()
                time_since_last_heartbeat = abs(current_time - last_heartbeat_time)
                print(
                    f"Time since last heartbeat for job {job.id}: {time_since_last_heartbeat}"
                )

                # If no heartbeat received within threshold, mark job as failed
                if time_since_last_heartbeat > config.STUCK_JOB_THRESHOULD_SECONDS:
                    print(f"Job {job.id} is stuck. Failing job.")
                    await update_job_details(
                        job.id,
                        {
                            "status": "failed",
                            "errorMessage": "Job is stuck, no heartbeat received recently",
                            "attempts": job.attempts + 1,
                        },
                    )

            # Handle jobs that are either new (created) or failed
            elif job.status == ["created", "failed"]:
                # Check if job has exceeded maximum retry attempts
                if job.attempts >= config.MAX_ATTEMPTS:
                    print(f"Job {job.id} has exceeded max attempts. Failing job.")
                    await update_job_details(
                        job.id,
                        {
                            "status": "max_attempts_exceeded",
                            "errorMessage": "Job has exceeded max attempts",
                        },
                    )

                # If job is not already being processed, add it to the queue
                elif job.id not in job_pending_or_in_progress:
                    print("Adding job to queue: ", job.id)
                    job_pending_or_in_progress.add(job.id)
                    await job_queue.put(job)

        sleep(5)  # Wait 5 seconds before next fetch


async def async_main():
    """
    Main async function that sets up and runs the job processing system.
    Creates a job queue and a set to track in-progress jobs, then starts the job fetcher.
    """
    job_queue = asyncio.Queue()
    job_pending_or_in_progress = set()

    job_fetcher_task = asyncio.create_task(
        job_fetcher(job_queue, job_pending_or_in_progress)
    )

    await asyncio.gather(job_fetcher_task)


def main():
    """
    Entry point of the application.
    Runs the async_main function using asyncio's event loop.
    """
    asyncio.run(async_main())


if __name__ == "__main__":
    main()
