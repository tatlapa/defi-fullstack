FROM node:20
WORKDIR /app

# Copier les fichiers de configuration npm pour installer les dépendances
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier le code
COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]
