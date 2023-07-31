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

**Important Note**: The `[demo]` in the following commands stands for the optional value of "demo". In the future not every deployment is a demo. Later normal releases are without the demo tag.
The X.Y.Z are placeholder for the version of the image. X is increased after every major update (new module). Y is increased for a smaller adjustment and Z is increased when the version conatins a patch (bug fix).

_Example_: Adding a new module (e.g. CRM) increases e.g. X=2 to X=3, adding a new page or adding a new logo increases e.g Y=1 to Y=2 and deploying a bug fix increases e.g. Z=4 to Z=5.

1.  Test application by running all containers and accessing the application:

    1.1 Navigate into `/deployment`and start testing docker-compose: `docker-compose -f docker-compose.testing.yaml --env-file .env.testing up --build`

    1.2 Go to `localhost:9000` to access the application and test if everything works

2.  Build images for server and backend

    2.1 Build image for the client:

         2.1.1 Navigate into `/client`

          2.1.2 Run `docker build -t jbtit/neomdb:client[-demo]X.Y.Z --build-arg REACT_APP_ENV=production .` for production build
          OR
          Run `docker build -t jbtit/neomdb:client[-demo]X.Y.Z --build-arg REACT_APP_ENV=development .` for development/demo build

    2.2 Build image for the server:

         2.2.1 Navigate into `/server`

         2.2.2 Run `docker build -t jbtit/neomdb:server[-demo]X.Y.Z .`

3.  Push the image to the private docker repository

    3.1 Run `docker login` and insert username and password

    3.2 Run `docker push jbtit/neomdb:client[-demo]X.Y.Z`

    3.3 Run `docker push jbtit/neomdb:server[-demo]X.Y.Z`

4.  Adjust docker-compose file (e.g. adjust tag of client and server image) and deploy it on the server (`/var/ww.vhosts/studentische-beratung.de/neomdb`)
5.  Log into the server, navigate to `/var/ww.vhosts/studentische-beratung.de/neomdb/deployment` and run `docker compose -f docker-compose.production.yaml --env-file .env.production up -d --build` for production build OR `docker compose -f docker-compose.development.yaml --env-file .env.development up -d --build` for development/demo build

Note: On the server docker uses limited-priviliege access token from docker.

## Deployment Diagram

![Deployment Diagram](deployment.png)
