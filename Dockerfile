FROM node:20-bullseye

RUN apt-get update && apt-get install -y \
  libssl1.1 openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 4000
CMD ["node", "dist"]
