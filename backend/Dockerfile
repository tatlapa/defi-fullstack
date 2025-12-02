FROM php:8.4-fpm

WORKDIR /var/www

# Installer les dépendances nécessaires
RUN apt-get update && apt-get install -y \
    bash \
    git \
    unzip \
    libpng-dev \
    libjpeg-dev \
    libzip-dev \
    libonig-dev \
    libicu-dev \
    curl \
    default-mysql-client \
    netcat-openbsd \
 && rm -rf /var/lib/apt/lists/*

# Configurer et installer les extensions PHP
RUN docker-php-ext-configure intl \
    && docker-php-ext-install pdo pdo_mysql mbstring zip gd intl

# Installer Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copier le code
COPY . .

# Installer les dépendances Laravel
RUN composer install --no-interaction

# Permissions
RUN chmod -R 777 storage bootstrap/cache

# Entrypoint pour automatiser les migrations et les seeders
COPY entrypoint.sh /usr/local/bin/entrypoint.sh

# Donner les permissions au fichier entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 8000
ENTRYPOINT ["entrypoint.sh"]