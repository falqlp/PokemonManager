FROM nginx:latest

COPY /nginx/nginx.conf /etc/nginx/nginx.conf

COPY ./nginx/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

COPY .env .env

ENTRYPOINT ["/entrypoint.sh"]
