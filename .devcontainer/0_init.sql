-- Initializes the privileges for the develop user
GRANT ALL PRIVILEGES ON mdb.* TO 'develop'@'%';
FLUSH PRIVILEGES;
