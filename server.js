const serverPort = process.env.SERVER_PORT || 3000;
const express = require('express');
const app = express();
const http = require('http').Server(app);
app.use(express.static(__dirname + '/client'));
http.listen(serverPort, () => console.log('\x1b[33m%s\x1b[0m', "Server is listening on port " + serverPort));