# Use the official Python image as the base image
FROM python:3.13-slim

# TODO: INSTALL VIDEO EDITING TOOLS - whisper

# Set the working directory
WORKDIR /app

# Copy the pyproject.toml and poetry.lock files for dependency caching
COPY pyproject.toml poetry.lock* ./

# Install  Poetry the dependencies
RUN pip install poetry
RUN poetry install --no-root

# Copy the rest of the application code
COPY . /app

# Run the asset-processing-service
CMD ["poetry", "run", "asset-processing-service"]

