FROM node:lts-slim


WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . ./


EXPOSE 3030

CMD ["npm","start"]