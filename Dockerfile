# -----------------------------------
FROM oven/bun:1-debian AS base
WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y \
    curl \
    ca-certificates \
    openssl \
    libssl-dev \
    && openssl version \
    && apt-get clean && rm -rf /var/lib/apt/lists/*
RUN mkdir -p /temp/prod

COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile
# -----------------------------------
FROM base AS release

COPY --from=base /temp/prod/node_modules ./node_modules
COPY . .

ARG VERSION
ARG GIT_SHA

ENV VERSION=$VERSION
ENV GITHUB_SHA=$GIT_SHA
ENV NODE_ENV=production

CMD [ "bun", "run", "src/index.ts" ]
# -----------------------------------