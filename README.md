# neoMDB

## Development
### Backend
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