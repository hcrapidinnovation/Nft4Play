FROM node:alpine
WORKDIR /app
COPY package*.json ./
ENV NODE_OPTIONS=--max-old-space-size=2048
COPY ./.env.production ./
RUN npm install --only-production
COPY . ./
RUN npm run build
COPY ./.env.production dist/
CMD npm run start:prod
