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
NGINX is needed for creating a web server that routes the https requests to the client and to the server. NGINX is configured in ./nginx/default.conf.

## Docker Composition
In ./docker-compose-yaml the different docker container are composed together.  Every Container is on the same network `neomdb_network`.
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
1. Test application by running all containers and accesing the application
2. Build images for server, backend and nginx
3. Adjust docker-compose file and deploy it on the server
4. Start the docker compose by running `docker-compose up --build`


TODO:
- Test image building
- Deploy files on server
- Start demo
- Test access
- Correctly configure prettier and eslint
- Clean up env