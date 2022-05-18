# web_kensyu_2022

## Play

https://tomohiko-ito-10antz.github.io/web_kensyu_2022/public/

## Build

```sh
docker-compose -f .devcontainer/docker-compose.yml up -d
docker-compose -f .devcontainer/docker-compose.yml exec node-dev npm install
docker-compose -f .devcontainer/docker-compose.yml exec node-dev npm run build
```

## Debug

```sh
docker-compose -f .devcontainer/docker-compose.yml up -d
docker-compose -f .devcontainer/docker-compose.yml exec node-dev npm run build
docker-compose -f .devcontainer/docker-compose.yml exec node-dev npm run deploy-debug
docker-compose -f .devcontainer/docker-compose.yml exec node-dev npm run serve
```

## Deploy

```sh
docker-compose -f .devcontainer/docker-compose.yml up -d
docker-compose -f .devcontainer/docker-compose.yml exec node-dev npm run build
docker-compose -f .devcontainer/docker-compose.yml exec node-dev npm run deploy
# push to remote main branch
```
