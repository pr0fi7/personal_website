# Use official Node.js image
FROM node:18

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build the React/Vite project
RUN npm run build

# Use Nginx to serve the frontend
FROM nginx:latest
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
