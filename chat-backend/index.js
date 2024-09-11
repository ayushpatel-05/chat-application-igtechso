const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const envConfig = require("./config/envConfig");
const connection = require("./config/database");
const errorHandler = require("./middleware/errorHandler");
// const isAuthenticatedUser = require('./middleware/socketAuthMiddleware');
const socketIO = require("socket.io");
const http = require("http");

//Router Imports
const userRoutes = require("./routes/userRoutes");

envConfig();
connection();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*", // Change this to the frontend URL in production
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true, //For now
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    credentials: true,
  })
);

// io.use(isAuthenticatedUser);

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  console.log("Here");
  if (token) {
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET_KEY); // Verify the JWT
      socket.user = user; // Attach user info to socket object
      next(); // Continue with the connection
    } catch (err) {
      return next(new Error("Authentication error")); // Fail the connection if token is invalid
    }
  } else {
    next(new Error("Authentication error")); // Fail if no token is provided
  }
});

//Imporvements needed:
//Should use socket.to.emit instead
io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);
  console.log(socket.user);

  // Handle incoming messages
  socket.on("message", (message) => {
    // Log message or handle it as needed
    console.log(`Message received: ${message}`);

    io.emit("receiveMessage", message);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

app.get("/", (req, res, next) => {
  res.send("Hello World");
});

app.use("/api/v1", userRoutes);
// app.use('/api/v1', reviewRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is runnig on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err);
});
