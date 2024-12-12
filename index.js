const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const workoutRoutes = require('./routes/workoutRoutes');

const cors = require('cors');
dotenv.config();
const app = express();


// Database:
mongoose.connect(process.env.MONGODB_STRING);

let db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection Error!"));
db.once("open", ()=> console.log("Connected to Database"));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}))


// for react
const corsOptions = {
	origin: ['http://localhost:4000'],
	credentials: true, 
	optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

// routes
app.use('/users', userRoutes);
app.use('/workouts', workoutRoutes);


if(require.main === module){
	app.listen(process.env.PORT || 3000, ()=> {
		console.log(`API is now online on port ${process.env.PORT || 3000}`);
	})
}

module.exports = {app, mongoose};