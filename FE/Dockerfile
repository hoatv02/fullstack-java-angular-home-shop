FROM nginx:alpine

WORKDIR /app
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY ./dist/dev/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
 