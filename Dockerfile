# Используем Node.js 18 как базовый образ
FROM node:18-alpine

# Устанавливаем OpenSSL (libressl) и другие зависимости для Prisma
RUN apk update && apk add --no-cache \
    openssl \
    bash \
    libressl \
    && rm -rf /var/cache/apk/*

# Создаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Генерируем Prisma клиент в папку node_modules, который в дальнейшем будет использоваться как пакет в приложении
COPY prisma ./prisma
ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
RUN npx prisma generate

# Копируем исходный код
COPY . .

# 👇 создаём директорию для логов и даём права root-пользователю
RUN mkdir -p /var/log/vy-accruals && chown root:root /var/log/vy-accruals

RUN npm run build

# Открываем порт
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "start"]
