# Contributing

If you like to contribute to this repository, please first discuss the change you wish to make by opening an issue.
Please consider to make use of .editorconfig in your IDE to mitigate indentation issues.

## Contribution Process
1. Open an issue describing the change you would like to implement in detail
2. Create a new branch referencing the created issue `#{number of issue}-short-descriptive-name` e.g. `#2-jwt-support`
3. Exclusively commit all changes regarding the issue to this branch
4. Diligently test your contribution
5. Pull `develop` branch into your created branch
6. Resolve merge conflicts
7. Open Pull Request


## Set Up Development Environment

### Backend

Download the `env.txt` file from the nextcloud and copy it into `/server` and change the name to `.env`

The server uses https to secure the communication between frontend and backend. 
To continue developing you'll need a self-signed certificate.

WINDOWS:
1. Download `selfsigned.key`, `selfsigned.crt`, `private.key`, `public.key`
2. Copy it into `\server\dev_certs`


UNIX:
1. Navigate to `/server`
2. Create Folder `mkdir dev_certs`
3. Create self-signed certificate and key by running:
 `sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./dev_certs/selfsigned.key -out ./dev_certs/selfsigned.crt`


3. Allow your browser to trust invalid certificates for localhost
    * Chrome: Type `chrome://flags/#allow-insecure-localhost`into search bar and enable "Allow invalid certificates for resources loaded from localhost."

    * Firefox:
      1. You have to start the backend server so Firefox can fetch the certificate from localhost
        1. Navigate to `/server`
        2. Run `npm i && npm start`
      2. Navigate to `Preferences > Privacy & Security > Certificates`
      3. Click `View Certificates`
      4. Navigate to `Servers`
      4. Click `Add Exception`
      5. Type `https://localhost:3030` into the form and click `Get Certificate`
      6. Add Exception


Development database can be found in the nextcloud, use MySQL and phpmyadmin within docker to continue development
    
  1. Install docker
  2. Create MySQL database `docker run -h localhost -p 3306:3306 --name mdb -e MYSQL_ROOT_PASSWORD=passw0rd -d mysql:latest` (for M1 architecture `docker run -h localhost -p 3306:3306 --name mdb -e MYSQL_ROOT_PASSWORD=passw0rd -d --platform linux/amd64 mysql:latest`)
  4. Start phpmyadmin instance `docker run --name mdb-phpmyadmin -d --link mdb:db -p 8081:80 phpmyadmin/phpmyadmin`
  5. In Browser navigate to `localhost:8081` (username: `root` | password: `passw0rd`)
  6. Create new database __user__ with all global privileges
  __IMPORTANT__: use the `Native MySQL authentication` as Authentication Plugin or database connection will fail.
  For more iformation see: https://github.com/mysqljs/mysql/pull/2233
  6. Create new database and import file from nextcloud into the new database
  7. Update your .env file accordingly

## Node and NPM
* For this Projekt Node Version 14 needs to be installed
* navigate into the `/server` folder, run `npm i` and do the same in the `/client` folder (to start the app rum `npm start`in each folder)
