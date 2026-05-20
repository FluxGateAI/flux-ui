FROM node:20-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm install --loglevel=error
COPY . .
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]

FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --loglevel=error
COPY . .
RUN npm run build

FROM nginx:alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
