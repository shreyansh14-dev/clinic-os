# Stage 1: Build Frontend Assets
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci || npm install
COPY . .
RUN npm run build

# Stage 2: Production Server
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev
COPY --from=build /app/dist ./dist
COPY server ./server

EXPOSE 5000
ENV NODE_ENV=production
ENV PORT=5000

CMD ["node", "server/index.js"]
