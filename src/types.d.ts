declare global {
  namespace Express {
    interface Request {
      clientIp: string;
    }
  }

  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      CONFIG_REMOTE: string;
      CONFIG_AUTH: string;
    }
  }
}

export {};
