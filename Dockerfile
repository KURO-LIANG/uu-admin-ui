FROM nginx:alpine
#FROM nginx
COPY /dist /usr/share/nginx/html
#COPY nginx.conf /usr/share/nginx/nginx.conf
ENV PMS_VERSION="UU-UI"
RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' >/etc/timezone
