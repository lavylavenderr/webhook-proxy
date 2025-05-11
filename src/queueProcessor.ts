import amqp from "amqplib";
import axios, { AxiosResponse } from "axios";
import Redis from "ioredis";
import fs from "fs";

import beforeShutdown from "./beforeShutdown";
import { error, log, warn } from "./log";
import { setup } from "./rmq";

const config = JSON.parse(fs.readFileSync("./config.json", "utf8")) as {
  port: number;
  queue: {
    enabled: boolean;
    rabbitmq: string;
    queue: string;
  };
  redis: string;
};

const redis = new Redis(config.redis);

const client = axios.create({
  validateStatus: () => true,
});

let rabbitMq: amqp.Channel | null = null;

export function getRabbitMq(): amqp.Channel | null {
  return rabbitMq;
}

export const rabbitReady = (async () => {
  try {
    rabbitMq = await setup(config.queue.rabbitmq, config.queue.queue);

    beforeShutdown(async () => {
      await rabbitMq?.close();
    });

    log("RabbitMQ channel set up.");

    log("Starting consumer...");
    await rabbitMq.prefetch(10);

    await rabbitMq.consume(
      config.queue.queue,
      async (msg) => {
        if (!msg) return;

        let data: any;

        try {
          data = JSON.parse(msg.content.toString());
          log("Received message for webhook ID:", data.id);
        } catch (e) {
          error("Failed to parse message:", e);
          return rabbitMq!.reject(msg, false);
        }

        try {
          const ratelimit = await redis.get(`webhookRatelimit:${data.id}`);
          const parsedLimit = parseInt(ratelimit ?? "1");

          if (parsedLimit === 0) {
            warn(`Rate limit active for webhook ${data.id}, requeuing...`);
            return rabbitMq!.reject(msg, false);
          }
        } catch (e) {
          error(`Failed Redis check for webhook ${data.id}:`, e);
          return rabbitMq!.reject(msg, true);
        }

        try {
          const response: AxiosResponse = await client.post(
            `http://localhost:${config.port}/api/webhooks/${data.id}/${data.token}?wait=false${
              data.threadId ? "&thread_id=" + data.threadId : ""
            }`,
            data.body,
            {
              headers: {
                "User-Agent": "WebhookProxy-QueueProcessor/1.0 (https://github.com/lewisakura/webhook-proxy)",
                "Content-Type": "application/json",
              },
            }
          );

          if (response.status === 429) {
            warn(`Webhook ${data.id} hit a rate limit, requeuing`);
            return rabbitMq!.reject(msg, false);
          }

          if (response.status >= 400 && response.status < 500) {
            warn(
              `Webhook ${data.id} responded with ${response.status} (bad request)`
            );
          } else {
            log(`Webhook ${data.id} processed successfully`);
          }

          rabbitMq!.ack(msg);
        } catch (e) {
          error(`Error sending webhook ${data.id}:`, e);
          rabbitMq!.reject(msg, true);
        }
      },
      { noAck: false }
    );

    return rabbitMq;
  } catch (e) {
    error("RabbitMQ init error:", e);
    process.exit(1);
  }
})();
