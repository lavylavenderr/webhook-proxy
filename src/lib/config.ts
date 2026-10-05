import axios from "axios"

interface Queue {
	enabled: boolean;
	rabbitmq: string;
	queue: string;
} 

interface ApplicationConfig {
   port: number;
	trustProxy: boolean;
	autoBlock: boolean;
	queue: Queue;
	redis: string;
	abuseThreshold: number;
}

export async function fetchApplicationConfig(): Promise<ApplicationConfig> {
    const { data } = await axios.get<ApplicationConfig>(Bun.env.CONFIG_REMOTE + "/webhook-dev.json", {
        auth: {
            username: "ilovecopypartycauseicanputanythinghere",
            password: Bun.env.CONFIG_AUTH
        },
        timeout: 5000
    })

    return data;
}