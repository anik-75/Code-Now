FROM openjdk:11
WORKDIR /tmp
RUN groupadd -r sandbox && useradd -r -g sandbox sandbox
USER sandbox
