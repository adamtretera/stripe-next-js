FROM node:10
WORKDIR usr/src/app

COPY package*.json ./
RUN npm install

ENV NODE_ENV=production

COPY . .
RUN npm run build
CMD ["npm","start"]