FROM node:16-alpine

WORKDIR /app

COPY package.json package-lock.json ./

COPY client server ./

RUN npm ci --omit=dev

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]