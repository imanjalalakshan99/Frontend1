FROM node:16-alpine 

WORKDIR /app

COPY . .

RUN npm ci 

RUN npm run build

COPY --from=frontend /app/dist ./dist

ENV NODE_ENV production

EXPOSE 5000

CMD [ "npm", "start"]