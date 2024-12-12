const express = require('express');
const workoutController = require('../controllers/workoutController');
const { verify } = require("../auth.js");

const router = express.Router();

router.post('/addWorkout', verify, workoutController.addWorkout);
router.get('/getMyWorkouts', verify, workoutController.getMyWorkouts);
router.patch('/updateWorkout/:id', verify, workoutController.updateWorkout);
router.delete('/deleteWorkout/:id', verify, workoutController.deleteWorkout);
router.patch('/completeWorkStatus/:id', verify, workoutController.completeWorkStatus)


module.exports = router;