FROM gcc:latest
WORKDIR /tmp
RUN groupadd -r sandbox && useradd -r -g sandbox sandbox
USER sandbox