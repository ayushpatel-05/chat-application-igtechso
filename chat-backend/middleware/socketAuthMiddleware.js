const jwt = require("jsonwebtoken");
// const User = require("../models/User");
// const catchAsyncError = require('../middleware/catchAsyncError');
// const ErrorMessage = require('../utils/errorMessage')


// exports.isAuthenticatedUser = (socket, next) => {
//     const token = socket.handshake.auth.token;
//     if (token) {
//         try {
//           const user = jwt.verify(token, 'your-secret-key'); // Verify the JWT
//           socket.user = user; // Attach user info to socket object
//           next(); // Continue with the connection
//         } catch (err) {
//           return next(new Error('Authentication error')); // Fail the connection if token is invalid
//         }
//       } else {
//         next(new Error('Authentication error')); // Fail if no token is provided
//       }
// }


// io.use((socket, next) => {
//     const token = socket.handshake.auth.token;
    
//     if (token) {
//       try {
//         const user = jwt.verify(token, 'your-secret-key'); // Verify the JWT
//         socket.user = user; // Attach user info to socket object
//         next(); // Continue with the connection
//       } catch (err) {
//         return next(new Error('Authentication error')); // Fail the connection if token is invalid
//       }
//     } else {
//       next(new Error('Authentication error')); // Fail if no token is provided
//     }
//   });