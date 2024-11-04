#!/bin/bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

echo "start Installing dependencies"
nvm use 18
pnpm bootstrap
export NODE_OPTIONS="--max_old_space_size=16384" && cd packages/nc-gui && pnpm run generate
rsync -rvzh --delete ./dist/ ../nocodb/docker/nc-gui
echo "start Build nocodb, package nocodb-sdk and nc-gui"
cd ../nocodb
EE=true ../../node_modules/.bin/webpack --config ../../packages/nocodb/webpack.local.config.js
echo "start Building docker image"
TIMESTAMP=$(date +%Y-%m-%d-%H%M%S) # 使用date命令将时间戳转换为Unix时间戳
BaseImage=nocdb
RemoteUrl=douguohai
AppRunEnv=dev
NameSpace=dev
RemoteImageName="${RemoteUrl}/${BaseImage}:${AppRunEnv}-${TIMESTAMP}"
docker buildx build --platform linux/arm,linux/arm64,linux/amd64 -f Dockerfile.local -t ${RemoteImageName} . --push || ERROR="build_image failed"
docker push "${RemoteImageName}"
docker rmi "${RemoteImageName}"
