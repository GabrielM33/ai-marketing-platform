import asyncio
from collections import defaultdict
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
        try:
            print("Fetching jobs...")
            jobs = await fetch_jobs()

            for job in jobs:
                current_time = asyncio.get_running_loop().time()
                # Check for stalled "in progress" jobs
                if job.status == "in_progress":
                    # Note: This looks like a typo and should be ==
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

            await asyncio.sleep(3)
        except Exception as e:
            print(f"Error in job fetcher: {e}")
            await asyncio.sleep(3)


async def worker(
    worker_id: int,
    job_queue: asyncio.Queue,
    job_pending_or_in_progress: set,
    job_locks: dict,
):
    while True:
        try:
            job = await job_queue.get()

            async with job_locks[job.id]:
                print(f"Worker {worker_id} is processing job {job.id}...")
                try:
                    # TODO: await process_job(job)
                    await update_job_details(job.id, {"status": "completed"})
                except Exception as e:
                    print(f"Error processing job {job.id}: {e}")
                    error_message = str(e)
                    await update_job_details(
                        job.id,
                        {
                            "status": "failed",
                            "errorMessage": error_message,
                            "attempts": job.attempts + 1,
                        },
                    )
                finally:
                    job_pending_or_in_progress.remove(job.id)
                    job_locks.pop(job.id, None)

            job_queue.task_done()
        except Exception as e:
            print(f"Error in worker {worker_id}: {e}")
            await asyncio.sleep(3)


async def async_main():
    """
    Main async function that sets up and runs the job processing system.
    Creates a job queue and a set to track in-progress jobs, then starts the job fetcher.
    """
    job_queue = asyncio.Queue()
    job_pending_or_in_progress = set()
    job_locks = defaultdict(asyncio.Lock)

    job_fetcher_task = asyncio.create_task(
        job_fetcher(job_queue, job_pending_or_in_progress)
    )

    workers = [
        asyncio.create_task(
            worker(
                i + 1,
                job_queue,
                job_pending_or_in_progress,
                job_locks,
            )
        )
        for i in range(config.MAX_NUM_WORKERS)
    ]

    await asyncio.gather(job_fetcher_task, *workers)


def main():
    """
    Entry point of the application.
    Runs the async_main function using asyncio's event loop.
    """
    asyncio.run(async_main())


if __name__ == "__main__":
    main()
