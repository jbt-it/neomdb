# Use Node.js 16 as the base image
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Install serve
RUN npm install -g serve

# Copy the rest of the client code
COPY . .

# Build the client app
RUN npm run build

# Set the command to run the client
CMD [ "serve", "-s", "build" ]