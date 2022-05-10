# web_kensyu_2022

## Build

```sh
docker-compose -f .devcontainer/docker-compose.yml up -d
docker-compose -f .devcontainer/docker-compose.yml exec node-dev npm install
docker-compose -f .devcontainer/docker-compose.yml exec node-dev npm run build
```

## Debug

```sh
docker-compose -f .devcontainer/docker-compose.yml up -d
docker-compose -f .devcontainer/docker-compose.yml exec node-dev npm run serve
```
