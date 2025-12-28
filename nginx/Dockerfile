FROM node:20-alpine

WORKDIR /app

COPY index.html .
COPY server.js .
COPY images ./images
COPY package.json .

RUN npm install

EXPOSE 3000

CMD ["npm","run","dev"]