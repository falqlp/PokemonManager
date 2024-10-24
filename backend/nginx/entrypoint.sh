#!/bin/bash

# Charger les variables d'environnement depuis le fichier .env
export $(grep -v '^#' .env | xargs)

# Vérifier que le port NGINX est défini
if [ -z "$NGINX_PORT" ]; then
  echo "Le port NGINX n'est pas défini dans le fichier .env"
  exit 1
else
  echo "NGINX va écouter sur le port $NGINX_PORT"

  # Copier le fichier de configuration dans /tmp pour le modifier
  cp /etc/nginx/nginx.conf /tmp/nginx.conf

  # Remplacer LISTEN_PORT dans le fichier temporaire
  sed -i "s/LISTEN_PORT/$NGINX_PORT/g" /tmp/nginx.conf

  # Copier le fichier modifié à son emplacement final
  cp /tmp/nginx.conf /etc/nginx/nginx.conf
fi

# Lancer NGINX en mode non-daemon
nginx -g 'daemon off;'
