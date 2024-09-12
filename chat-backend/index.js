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
const Conversation = require('./models/Conversation');
const Message = require('./models/Message');

//Router Imports
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const User = require("./models/User");

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


const userToSocketMap = {};
const conversationId = {};

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
// io.on("connection", (socket) => {
//   console.log(`New client connected: ${socket.id}`);
//   console.log(socket.user);

//   // Handle incoming messages
//   socket.on("message", async ({message, conversationId}) => {
//     // Log message or handle it as needed
//     console.log(`Message received: ${message}`);

//     const messageDocument = new Message.create({content: message, conversationId, socket.user.id});
//     await messageDocument.save(); 

//     io.emit("receiveMessage", message);
//   });

//   socket.on("newChat", async ({message, recieverId}) => {
//     const recieverDocument = await User.findById(recieverId).exec();
//     // const senderDocument = await User.findById(socket.user.id).exec();
//     if(!recieverDocument) {
//         // socket.to(socket.id).emit("error")
//         socket.emit("error", "No such user exists");
//     }

//     const conversationDocument = new Conversation({participants: [recieverDocument._id, socket.user.id]});
//     await conversationDocument.save();
//     socket.emit("newConversation", conversationDocument._id);
//     io.emit("receiveMessage", {conversationDocument._id , message});
//   });


//   // Handle disconnection
//   socket.on("disconnect", () => {
//     console.log(`Client disconnected: ${socket.id}`);
//   });
// });


io.on("connection", async (socket) => {
    console.log("Here");
    console.log(`New client connected: ${socket.id}`);
    console.log(socket.user);
    userToSocketMap[socket.user.id] = socket.id;
    const conversations = await Conversation.find({ participants: socket.user.id }).exec();

    conversations.map((conversation) => {
      socket.join(conversation._id);
    });

  
    // Handle incoming messages
    socket.on("message", async ({ message, conversationId }) => {
      try {
        // Log and save the message
        console.log(`Message received in conversation ${conversationId}: ${message}`);
        const messageDocument = new Message({
          content: message,
          conversationId,
          senderId: socket.user.id
        });
        await messageDocument.save();
  
        // Emit the message to all clients in the room for this conversation
        io.to(conversationId).emit("receiveMessage", {
          conversationId,
          message: messageDocument.content
        });
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", "Failed to send message");
      }
    });
  
    // Handle starting a new chat
    socket.on("newChat", async ({ message, recieverId }) => {
      try {
        const recieverDocument = await User.findById(recieverId).exec();
        if (!recieverDocument) {
          socket.emit("error", "No such user exists");
          return;
        }
  
        // Create a new conversation and have both users join its room
        const conversationDocument = new Conversation({
          participants: [recieverDocument._id, socket.user.id]
        });
        await conversationDocument.save();
  
        // Have both users join the new conversation room
        socket.join(conversationDocument._id);
        // io.to(recieverDocument._id).emit("joinConversation", conversationDocument._id);
        const recieverSocket = io.sockets.sockets.get(userToSocketMap[recieverId]);
        recieverSocket.join(conversationDocument._id);

        // Emit the first message in the conversation
        io.to(conversationDocument._id).emit("receiveFirstMessage", {
          conversationId: conversationDocument._id,
          message
        });
      } catch (error) {
        console.error("Error starting new chat:", error);
        socket.emit("error", "Failed to start new chat");
      }
    });
  });
  



app.get("/", (req, res, next) => {
  res.send("Hello World");
});

app.use("/api/v1", userRoutes);
app.use("/api/v1", messageRoutes);
// app.use('/api/v1', reviewRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is runnig on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err);
});
