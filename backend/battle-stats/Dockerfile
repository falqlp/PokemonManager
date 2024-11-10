# Étape 1 : Utilisation de l'image Node.js 20 pour construire l'application
FROM node:20 AS builder

WORKDIR /

# Copier les fichiers package.json et package-lock.json

# Copier tous les fichiers de l'application et des dossiers partagés
COPY battle-stats/. battle-stats/.
COPY shared/. shared/.

# Installer les dépendances de l'application
WORKDIR /shared
RUN npm install

WORKDIR /battle-stats
RUN npm install

# Construire l'application
RUN npm run build

# Étape 2 : Utilisation d'une image plus légère pour exécuter l'application
FROM node:20-alpine

WORKDIR /battle-stats

# Copier les dépendances installées et les fichiers construits depuis l'étape précédente
COPY --from=builder /battle-stats/node_modules ./node_modules
COPY --from=builder /battle-stats/dist ./dist

# Définir la variable d'environnement pour le port
ENV BATTLE_STATS_PORT 3000

# Exposer le port de l'application
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["node", "dist/battle-stats/src/main"]
