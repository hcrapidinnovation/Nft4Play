FROM node:alpine
WORKDIR /app
COPY package*.json ./
COPY ./.env.production ./
RUN npm install --only-production
COPY . ./
RUN npm run build
COPY ./.env.production dist/
CMD node dist/src/main.js
