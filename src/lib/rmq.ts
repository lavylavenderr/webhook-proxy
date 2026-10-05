import amqp from "amqplib";

export async function setup(host: string, queue: string) {
  const url = new URL(host);

  const connection = await amqp.connect({
    protocol: url.protocol.replace(":", ""),
    hostname: url.hostname,
    port: parseInt(url.port),
    username: url.username,
    password: url.password,
    frameMax: 8192,
  });

  const channel = await connection.createChannel();

  await channel.assertQueue(queue, {
    durable: true,
    deadLetterExchange: queue + '-dead',
  });

  await channel.assertQueue(queue + '-dead', {
    durable: true,
    deadLetterExchange: queue,
    messageTtl: 2000,
  });

  return channel;
}
