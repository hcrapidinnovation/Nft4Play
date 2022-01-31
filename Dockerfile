FROM node:alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only-production
COPY . ./
RUN npm run build
CMD node dist/src/main.js
