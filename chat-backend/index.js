const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require('path')
const connection = require('./config/database');
const ErrorHandler = require('./middleware/ErrorHandler');

//Router Imports
const userRoutes = require('./routes/UserRoutes');
const reviewRoutes = require('./routes/ReviewRoutes');


try {
    const envFilePath = path.resolve(__dirname, 'config/.env');
    // console.log("Here: ",envFilePath);
    dotenv.config({path: envFilePath});
    console.log(process.env.PORT);
    // console.log(process.env.MONGO_URL);
}
catch(err) {
    console.log("Env Config Error:", err);
}
connection();


const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: true,//For now
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    credentials: true
}));


app.get('/', (req, res, next) => {
    res.send("Hello World");
});

app.use('/api/v1', userRoutes);
app.use('/api/v1', reviewRoutes);


app.use(ErrorHandler);

// const 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is runnig on port ${PORT}`);
});



process.on("unhandledRejection", (err) => {
    console.log(err);
})