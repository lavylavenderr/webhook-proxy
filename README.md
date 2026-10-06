# Discord Webhook Proxy

Hi there, this is a "modernized" version of the popular webhook proxy originally created by [lewisakura](https://github.com/lewisakura), with the original repo [here](https://github.com/lewisakura/webhook-proxy).

As someone who loves to use Docker, I decided to take it upon myself to update the project with the following:

- **Prisma 8**, the latest version of Prisma
- **MongoDB** as the database, to suit my use case
- **Remote config**: `config.json` is fetched from a remote server instead of being mounted, because I do not like messing around with mounts on Docker

These changes are for my use case only, but if you wish to use this, feel free to reference the following instructions.

## How it works

On startup, the proxy fetches its configuration over HTTP using Basic Auth. In my setup the file is served by [copyparty](https://github.com/9001/copyparty), but any server that returns your `config.json` behind Basic Auth will work. 

The config file referenced by the original project has not been changed, but can also be found in `config.example.json` for your reference.

## Requirements

- Docker (and Docker Compose)
- A MongoDB instance (self-hosted or Atlas)
- A server hosting your `config.json` (e.g. copyparty) behind authentication,
    > I should mention that this is not require (at least the authentication part), however given you'd have RabbitMQ credentials, I highly advise locking it behind some sort of authentication. Feel free to update `src/lib/config.ts` with how you desire to fetch your config as that is where it is handled.

## Environment Variables

| Variable | Description | Example |
| --- | --- | --- |
| `DATABASE_URL` | MongoDB connection string used by Prisma | `mongodb://user:pass@mongo:27017/webhook-proxy` |
| `CONFIG_REMOTE` | URL to your remote server (minus "/config.json") | `http://copyparty.hyacinth.ca/configs` |
| `CONFIG_AUTH` | basic Auth Password | `RawrUwuOwO` |

> Ensure you adjust the above to actually be their respective values. **There is no username variable because Copyparty only checks passwords, not usernames when authenticating people.**


## Setup

Here is where I would put how to set this up, however I will have to come back and redo this as a lot of my time was spent reading documentation in order to get Prisma to work properly, sorry :((

## Usage

Simply replace `discord.com` with your Proxy URL as demonstrated below:

```
https://discord.com/api/webhooks/<id>/<token>
```

becomes

```
https://your-proxy.example.com/api/webhooks/<id>/<token>
```

## Credits

- [lewisakura](https://github.com/lewisakura) for the original [webhook-proxy](https://github.com/lewisakura/webhook-proxy)
- my blahaj that kept me company while i bashed my head on my keyboard

## License

Reference the original license (which is in this and the original repo), thanks for reading :DD 