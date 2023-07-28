# DEPLOYMENT

This file explains how to deploy the neoMDB application.
We use Docker to deploy the neoMDB by composing different docker containers together.

## Dockerfiles

The client and the server both have a Dockerfile which specifies the container build to run the client/server.

## Database

For demonstration purposes the first versions of the neoMDB application uses its own database located in a docker.

In the docker compose file (./docker-compose.yaml) a mysql container and a PhpMyAdmin container are started.

!IMPORTANT: Do not forget to add a database and user to the mysql container when deploying (see normal Setup).

## NGINX

NGINX is needed for creating a proxy that routes the https requests to the client and to the server. NGINX is configured in ./nginx/default.conf.

## Docker Composition

In ./docker-compose-yaml the different docker container are composed together. Every Container is on the same network `neomdb_network`.

### Client Container

The Dockerfile of the client is used to build the neomdb client container and is exposed to 3000.

### NGINX Container

The NGINX Container is built with the nginx image and saves the default.conf of NGINX and the SSL certificates in the container.

### Database Container

The Database Container is built with the mysql image and uses environment variable MYSQL_ROOT_PASSWORD.

### PhpMyAdmin Container

The PhpMyAdmin Container is built with the phpmyadmin image and is linked to the database container, because it needs the mysql container to start before it can run.

### Server Container

The Dockerfile of the server is used to build the neomdb server container and is exposed to 3030. It creates some environment variables to indicate that the server is running in production (which changes some configurations), where the database host is located and which port for the database is used.

## Process

1. Test application by running all containers and accessing the application
2. Build images for server and backend

   2.1 docker build -t jbtit/neomdb:client[-demo]X.Y.Z

   2.2 docker build -t jbtit/neomdb:server[-demo]X.Y.Z

3. Push the image to the private docker repository

   3.1 docker login

   3.2 docker push jbtit/neomdb:client[-demo]X.Y.Z

   3.3 docker push jbtit/neomdb:server[-demo]X.Y.Z

4. Adjust docker-compose file if necessary and deploy it on the server (`/var/ww.vhosts/studentische-beratung.de/neomdb`)
5. Log into the server, navigate to `/var/ww.vhosts/studentische-beratung.de/neomdb` and run `docker-compose up -d --build`

TODO:

- Use CHatGPT such that the secrets are used for the phpMyAdmin and the server container
- Test docker-compose
- Use ChatPGT such that env variables can be used inside of the react app
- Test docker-compose

- Neues Logo einfügen
- Finalize documentation
  - Add deployment diagram
  - Explain deployment process in detail
