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

# Disable Prettier during Docker build // TODO: Remove this line when the issue is fixed
ENV SKIP_PREFLIGHT_CHECK=true

# Build the client app
RUN npm run build

# Set the command to run the client
# CMD [ "npm", "start" ]
CMD [ "serve", "-s", "build" ]
