FROM node:16-alpine

WORKDIR /app

COPY package.json package-lock.json ./

COPY . .

RUN npm ci --omit=dev

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]