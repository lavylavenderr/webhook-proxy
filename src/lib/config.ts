import axios from "axios";

interface Queue {
  enabled: boolean;
  rabbitmq: string;
  queue: string;
}

interface ApplicationConfig {
  port: number;
  trustProxy: number | boolean;
  autoBlock: boolean;
  queue: Queue;
  redis: string;
  abuseThreshold: number;
}

export async function fetchApplicationConfig(): Promise<ApplicationConfig> {
  // feel free to change and modify as you see fit :)
  const { data } = await axios.get<ApplicationConfig>(
    `${Bun.env.CONFIG_REMOTE}${Bun.env.NODE_ENV === "development" ? "/webhook-dev.json" : "/webhook.json"}`,
    {
      auth: {
        username: "ilovecopypartycauseicanputanythinghere",
        password: Bun.env.CONFIG_AUTH,
      },
      timeout: 5000,
    },
  );

  return data;
}
