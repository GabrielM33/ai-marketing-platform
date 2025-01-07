from datetime import datetime
from typing import Any, Dict, List

import aiohttp
from asset_processing_service.config import HEADERS, config
from asset_processing_service.models import AssetProcessingJob


async def fetch_jobs() -> List[AssetProcessingJob]:
    """
    Asynchronously fetches asset processing jobs from the API.

    Makes a GET request to the asset-processing-jobs endpoint and converts
    the JSON response into AssetProcessingJob objects.

    Returns:
        List[AssetProcessingJob]: List of jobs fetched from the API
        Returns empty list if the request fails
    """
    try:
        url = f"{config.API_BASE_URL}/asset-processing-jobs"

        async with aiohttp.ClientSession() as session:
            async with session.get(url, headers=HEADERS) as response:
                if response.status == 200:
                    data = await response.json()

                    # Parse the JSON data into AssetProcessingJob instances
                    jobs = [AssetProcessingJob(**item) for item in data]
                    return jobs

                else:
                    print("Error fetching jobs: ", response.status)
                    return []
    except aiohttp.ClientError as error:
        print("Error fetching jobs: ", {error})
        return []


async def update_job_details(job_id: str, update_data: Dict[str, Any]) -> None:
    """
    Updates the details of a specific job in the API.

    Makes a PATCH request to update job status, adding the current timestamp
    as the lastHeartbeat.

    Args:
        job_id: The ID of the job to update
        update_data: Dictionary containing the fields to update (status, errorMessage, etc.)

    Raises:
        Prints error message if the update request fails
    """
    # Add current timestamp to the update data
    data = {**update_data, "lastHeartbeat": datetime.now().isoformat()}

    try:
        url = f"{config.API_BASE_URL}/asset-processing-jobs/{job_id}"
        async with aiohttp.ClientSession() as session:
            async with session.patch(url, json=data, headers=HEADERS) as response:
                response.raise_for_status()
    except aiohttp.ClientError as error:
        print(f"Failed to update job details for job {job_id}: {error}")
