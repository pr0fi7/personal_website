# Build Stage
FROM node:18 AS build

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy frontend files and build
COPY . .
RUN npm run build

# Production Stage: Serve with Nginx
FROM nginx:latest

# Remove default Nginx index.html
RUN rm -rf /usr/share/nginx/html/*

# Copy the built frontend files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Replace default Nginx config with our custom one
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
