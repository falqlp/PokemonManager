FROM nginx:latest

RUN echo "test"
# Copier le fichier de template de configuration nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copier le script d'entrée
COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh


# Copier le fichier .env
COPY .env .env

# Définir l'ENTRYPOINT
ENTRYPOINT ["/entrypoint.sh"]
