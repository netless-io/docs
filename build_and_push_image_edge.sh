set -exo pipefail
# 构建 iamge，同时部署

image=netless-developer-docs-en
version=1.0.0

hash=$(git rev-parse --short HEAD)

docker build -f Dockerfile -t registry.cn-hangzhou.aliyuncs.com/white/$image:$version-$hash -t registry.cn-hangzhou.aliyuncs.com/white/$image:latest .
docker push registry.cn-hangzhou.aliyuncs.com/white/$image:$version-$hash
docker push registry.cn-hangzhou.aliyuncs.com/white/$image:latest

ssh app@k8s-cloud -tt "cd /home/app/k8s-stack/site/developer.herewhite.com && \
    kubectl apply -f docs-en.yml && \
    kubectl patch deployment netless-developer-docs-en -n site --patch '{\"spec\": {\"template\": {\"metadata\": {\"annotations\": {\"version\": \"$version-$hash\"}}}}}'"