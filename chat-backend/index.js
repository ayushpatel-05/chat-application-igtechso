const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors"); 
const envConfig = require('./config/envConfig');
const connection = require('./config/database');
const errorHandler = require('./middleware/errorHandler')
const socketIO = require("socket.io");
const http = require('http');

//Router Imports
const userRoutes = require("./routes/userRoutes")



envConfig();
connection();


const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: '*',  // Change this to the frontend URL in production
        methods: ['GET', 'POST'],
    }
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: true,//For now
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    credentials: true
}));





//Imporvements needed:
//Should use socket.to.emit instead
io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);
  
    // Handle incoming messages
    socket.on('message', (message) => {
      // Log message or handle it as needed
      console.log(`Message received: ${message}`);
  
      // You can forward the message to a specific user or all users
      // For example, broadcasting to all connected users
      io.emit('receiveMessage', message);
    });
  
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });










app.get('/', (req, res, next) => {
    res.send("Hello World");
});







app.use('/api/v1', userRoutes);
// app.use('/api/v1', reviewRoutes);








app.use(errorHandler);











const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is runnig on port ${PORT}`);
});



process.on("unhandledRejection", (err) => {
    console.log(err);
})