# neoMDB

## Development
### Backend

Download the .env file from the nextcloud and copy it into `/server`

The server uses https to secure the communication between frontend and backend. 
To continue developing you'll need a self-signed certificate.


1. Navigate to the root level of `server`
2. Create self-signed certificate and key by running:
 `sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./dev_certs/selfsigned.key -out ./dev_certs/selfsigned.crt`
3. Allow your browser to trust invalid certificates for localhost
    * Chrome: Type `chrome://flags/#allow-insecure-localhost`into search bar and enable "Allow invalid certificates for resources loaded from localhost."

    * Firefox:
      1. Navigate to `Preferences > Privacy & Security > Certificates`
      2. Click `View Certificates`
      3. Click `Add Exception`
      4. Type `https://localhost:3030` into the form
      5. Add Exception


Development database can be found in the nextcloud, use MySQL and phpmyadmin within docker to continue development
    
  1. Install docker
  2. Create MySQL database `docker run -h localhost -p 3306:3306 --name mdb -e MYSQL_ROOT_PASSWORD=passw0rd -d mysql:latest`
  3. Start phpmyadmin instance `docker run --name mdb-phpmyadmin -d --link mdb:db -p 8081:80 phpmyadmin/phpmyadmin`
  4. In Browser navigate to `localhost:8081`
  5. Create new database user with all global privileges
  __IMPORTANT__: use the `Native MySQL authentication` as Authentication Plugin or database connection will fail.
  For more iformation see: https://github.com/mysqljs/mysql/pull/2233
  6. Create new database and import file from nextcloud
  7. Update your .env file accordingly
