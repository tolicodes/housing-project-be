const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');
const socketio = require('socket.io');
const fs = require('fs');
const path = require('path');
const https = require('https');
const passport = require('passport')

require('dotenv').config();

const routes = require('./routes');

// define the Express app
const app = express();

const certOptions = {
    key: fs.readFileSync(path.resolve('./localhost.key')),
    cert: fs.readFileSync(path.resolve('./localhost.crt'))
}

server = https.createServer(certOptions, app)

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

const io = socketio(server)
app.set('io', io)

server.listen(8081, () => {
    console.log('listening on port 8081');
});

app.use(routes);