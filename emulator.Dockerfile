# syntax=docker/dockerfile:1
# check=error=true

ARG GOOGLE_SDK_VERSION=496.0.0
FROM google/cloud-sdk:${GOOGLE_SDK_VERSION}-emulators

ARG JAVA_VERSION=17
RUN apt-get update && apt-get install -y openjdk-${JAVA_VERSION}-jre-headless
ENV JAVA_HOME=/usr/lib/jvm/java-${JAVA_VERSION}-openjdk-amd64
