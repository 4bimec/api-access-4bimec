import app from "./app"
import { networkInterfaces }  from 'os'
import http from "http"
import https from "https"
const fs = require('fs');
const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS;


const interfaces = networkInterfaces();


app.use(redirectToHTTPS());

// Criar servidor HTTP
const httpServer = http.createServer(app);

// Criar servidor HTTPS
const options = {
  key: fs.readFileSync('/home/backendacesso/api-acesso/api-access-4bimec/chave-privada.pem'),
  cert: fs.readFileSync('/home/backendacesso/api-acesso/api-access-4bimec/certificado.pem'),
};


const httpsServer = https.createServer(options, app);

const httpPort = process.env.HTTP_PORT || 3007;
const httpsPort = process.env.HTTPS_PORT || 3008;
// Procura por uma interface de rede não interna com um endereço IPv4
const ip = Object.values(interfaces)
  .flat()
  .find(interfaceInfo => interfaceInfo.family  === 'IPv4' && !interfaceInfo.internal)


if(ip) {
    console.log('endereço de ip', ip.address)
}

export const ipMachine = ip.address
const port = process.env.PORT || 3008;

httpServer.listen(httpPort, () => {
  console.log(`Servidor HTTP rodando na porta ${httpPort}`);
});

httpsServer.listen(httpsPort, () => {
  console.log(`Servidor HTTPS rodando na porta ${httpsPort}`);
});

//app.listen(port, console.log(`servidor rodando no endereço de IP: ${ipMachine} na porta: ${port}`))

