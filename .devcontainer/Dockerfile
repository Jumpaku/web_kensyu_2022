FROM node:16-bullseye-slim

ENV DEBIAN_FRONTEND=noninteractive

RUN apt update -y && apt install -y npm git curl \
    && npx -y n 16.15.0 \
    && npm install -g npm@8.8.0
WORKDIR /node-dev
#ENV PATH=/node-dev/node_modules;$PATH