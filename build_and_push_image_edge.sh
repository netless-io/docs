set -exo pipefail

image=netless-developer-docs-en
version=1.0.0

hash=$(git rev-parse --short HEAD)

docker build -f Dockerfile -t registry.cn-hangzhou.aliyuncs.com/white/$image:$version-$hash -t registry.cn-hangzhou.aliyuncs.com/white/$image:latest .
docker push registry.cn-hangzhou.aliyuncs.com/white/$image:$version-$hash
docker push registry.cn-hangzhou.aliyuncs.com/white/$image:latest

ssh k8s-site -tt "kubectl patch deployment docs-en -n site --patch '{\"spec\": {\"template\": {\"metadata\": {\"annotations\": {\"version\": \"$version-$hash\"}}}}}'"