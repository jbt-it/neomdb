# ---- First stage: complete build with all files
# Use Node.js 16 as the base image
FROM node:16-alpine as intermediate
# Set the working directory
WORKDIR /app
# Copy package.json and package-lock.json (if available)
COPY package*.json ./
# Install dependencies
RUN npm install
# Copy the rest of the client code
COPY . .
# Uses the env variable set by docker-compose to determine which .env file to use
ARG REACT_APP_ENV
# Copies the respective env file (.env.production or .env.testing) to .env
RUN mv .env.${REACT_APP_ENV} .env


# ---- Second stage: run build command and exclude unnecessary environment files
FROM node:14
WORKDIR /app
# Install serve
RUN npm install -g serve
COPY --from=intermediate /app ./
RUN npm run rerun-prettier
# Remove environment files sucht that only the .env file that we created in the first stage is used
RUN rm -f .env.development .env.production .env.testing
# Build the client app
RUN npm run build
# Set the command to run the client
CMD [ "serve", "-s", "build" ]