#!/bin/sh
set -e

# Attendre la base de données
until nc -z database 3306; do
  echo "Waiting for MySQL..."
  sleep 2
done

# Lancer les migrations et les seeders
php artisan migrate --force
php artisan db:seed --force


# Démarrer le serveur Laravel
php artisan serve --host=0.0.0.0 --port=8000
