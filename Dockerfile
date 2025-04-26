<<<<<<< HEAD
FROM node:16-alpine 
=======
FROM node:16-alpine AS frontend
>>>>>>> 871aac22e0f9d64d6302168ab2809ac3b19b6c48

WORKDIR /app

COPY . .

RUN npm ci 

<<<<<<< HEAD
RUN npm run build

COPY --from=frontend /app/dist ./dist

ENV NODE_ENV production

EXPOSE 5000

CMD [ "npm", "start"]
=======
RUN npm run build
>>>>>>> 871aac22e0f9d64d6302168ab2809ac3b19b6c48
