FROM node:22-slim

RUN apt-get update && apt-get install -y \
  openssl libssl1.1 ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

CMD ["node", "dist"]
