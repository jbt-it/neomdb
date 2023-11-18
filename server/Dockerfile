# Use Node.js 18 as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the server code
COPY . .

# Build the application
# This will run `tsoa spec-and-routes` and `tsc`
RUN npm run build

# Set the command to run the server
CMD [ "npm", "start" ]
