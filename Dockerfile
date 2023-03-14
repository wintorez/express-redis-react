FROM node:16-alpine

WORKDIR /app

COPY . .

RUN npm ci --omit=dev

RUN npm run build -w client

EXPOSE 3000

EXPOSE 3001

CMD ["npm", "start"]