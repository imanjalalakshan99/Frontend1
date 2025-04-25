FROM node:16-alpine AS frontend

WORKDIR /app

COPY . .

RUN npm ci 

RUN npm run build