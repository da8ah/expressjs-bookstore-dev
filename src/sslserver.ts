/** HTTPS Server Sample Code

 * OpenSSL Cert Generation:

    Certs Path: src/lib/cert/
    openssl genrsa -out key.pem
    openssl req -new -key key.pem -out csr.pem
    openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem
    
*/

import https from 'https';
import path from 'path';
import fs from 'fs';

import app from './app';
import './database';

const port = app.get("port");

const sslServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname, "lib/cert", "key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "lib/cert", "cert.pem"))
}, app);

sslServer.listen(port, () => {
    console.log(`Server on port ${port}`);
});

export default sslServer;