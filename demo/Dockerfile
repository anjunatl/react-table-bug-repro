FROM php:7.4-cli
WORKDIR /bug-demo/
COPY laravel ./
RUN apt-get update
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get update && apt-get install -y git zip unzip nodejs lnav
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN pecl install xdebug
RUN composer install
RUN npm install
RUN npm run prod
CMD php artisan serve --host=0.0.0.0
