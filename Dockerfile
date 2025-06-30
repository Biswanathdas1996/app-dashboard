# Base Python image
FROM python:3.11.4
 
# Install OS dependencies
RUN apt-get update && \
    apt-get install -y git libgl1-mesa-glx libglib2.0-0 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
 
# Set working directory
WORKDIR /src
 
# Copy the codebase
COPY . .
 
# Copy .env file into image
# Note: For security in production, handle secrets via Kubernetes secrets or external config!
COPY .env .env
 
# Set env var to avoid interactive prompts
ENV PYTHONUNBUFFERED=1 \
    GIT_PYTHON_REFRESH=quiet
 
# Install Python dependencies
RUN pip install --no-cache-dir --prefer-binary -r requirements.txt
 
# Expose the app port
EXPOSE 5000
 
# Start the app
CMD ["python3", "main.py"]