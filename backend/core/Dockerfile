# Étape 1 : Utilisation de l'image Node.js 20 pour construire l'application
FROM node:20 AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances de l'application
RUN npm install

# Copier tous les fichiers de l'application
COPY . .

# Construire l'application
RUN npm run build

# Étape 2 : Utilisation d'une image plus légère pour exécuter l'application
FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les dépendances installées et les fichiers construits depuis l'étape précédente
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Définir la variable d'environnement pour le port
ENV CORE_PORT 3000

# Exposer le port de l'application
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["node", "dist/main"]
