FROM node:16-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV production

EXPOSE 3001

CMD ["npm", "start"]