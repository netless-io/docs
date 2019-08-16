FROM openresty/openresty:centos
COPY ./website/build/netless /usr/local/openresty/nginx/build
COPY ./nginx.conf /usr/local/openresty/nginx/conf/nginx.conf
EXPOSE 3000 35729
CMD ["openresty"]