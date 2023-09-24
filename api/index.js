const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const Message = require('./models/Message');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs')

//websocket library
const ws = require('ws');

const dotenv = require('dotenv');
dotenv.config(); //load the .env config file

const connectionString = `${process.env.MONGO_URL}/WeChat`;
const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

//function to initialize connection to database
async function main() {
    await mongoose.connect(connectionString);
}

//initialize database connection and show error if failed.
main().catch(err => console.log(err));

//Create express instance.
const app = express();

// allow the express app to use cors with options.
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
}));

// allow the express app to use json parser and cookie parser.
app.use(express.json());
app.use(cookieParser());


//Endpoint to test if server is running.
app.get('/test', (req, res) => {
    res.json('test ok');
});

//Endpoint to create / register a new user.
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPass = bcrypt.hashSync(password, bcryptSalt);
        const createdUser = await User.create({
            username: username,
            password: hashedPass
        });

        jwt.sign({ userId: createdUser._id, username }, jwtSecret, (err, token) => {
            if (err) throw err;

            res.cookie('token', token, { sameSite: 'none', secure: true }).status(201).json({
                userId: createdUser._id,
            });
        });

    } catch (err) {
        if (err) throw err;

        res.status(500).json('error');
    }
});

// Endpoint for logging in a user.
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const foundUser = await User.findOne({ username });
    if (foundUser) {
        const passOk = bcrypt.compareSync(password, foundUser.password);
        if (passOk) {
            jwt.sign({ userId: foundUser._id, username }, jwtSecret, (err, token) => {
                if (err) throw err;

                res.cookie('token', token, { sameSite: 'none', secure: true }).status(201).json({
                    userId: foundUser._id,
                });
            });
        }
    }
})

//Endpoint to verify the Cookie for current user and return user data
app.get('/currentUser', (req, res) => {
    const token = req.cookies?.token;

    if (token) {
        jwt.verify(token, jwtSecret, (err, userData) => {
            if (err) throw err;

            res.json(userData);
        });
    } else {
        res.status(401).json('no token')
    }

});



// Run app on server port 8443
const server = app.listen(8443);

// Creating Websocket server. Note that we pass our express() app server
// On top of it this websocket is running

const webSocketServer = new ws.WebSocketServer({ server });
//webSocketServer is the server object returned.

//creating connection
webSocketServer.on('connection', (connection, req) => {
    //connection --> client connection | req --> the request sent from client
    //on connection, fetching the cookies sent to the server
    const cookies = req.headers.cookie;

    if (cookies) {

        //if cookie present extract the token we used in jwt
        const tokenString = cookies.split('; ').find(str => str.startsWith('token='))
        if (tokenString) {

            //extract the token string
            const token = tokenString.split('=')[1];

            //verify the token string in jwt to get the userdata
            jwt.verify(token, jwtSecret, (err, userData) => {
                if (err) throw err;

                const { userId, username } = userData

                //put the userdata into the connection.
                connection.userId = userId;
                connection.username = username;
            });
        }
    }


    //extract the number of client connected to server and return the number of online users
    [...webSocketServer.clients].forEach(client => {
        client.send(JSON.stringify({
            online:
                [...webSocketServer.clients].map(c => ({ userId: c.userId, username: c.username }))
        }));
    });


    //event when some user sends a message
    connection.on('message',async (messageData) => {
        messageData = JSON.parse(messageData.toString());
        const {recipient, message} = messageData;
        
        if (recipient && message) {
            //Create a record in the database
            const messageDoc = await Message.create({
                sender:connection.userId,
                recipient,
                message,
            });

            [...webSocketServer.clients]
                .filter(c => c.userId === recipient)
                .forEach(client => {
                    //send message to each client connection with the recipirent ID
                    client.send(JSON.stringify(
                        {
                            messageId:messageDoc._id,
                            sender: connection.userId,
                            text: message
                        }
                    ));
                })

        }
    })
});
