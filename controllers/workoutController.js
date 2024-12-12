const express = require ('express');
const UserModel = require('../model/UserModel');
const WorkoutModel = require('../model/WorkoutModel');

const bcrypt = require("bcrypt");
const auth = require('../auth.js');
const { errorHandler } = auth;

module.exports.addWorkout = (req, res) => {
	// console.log(req.user.id);
	const {name, duration, dateAdded, status} = req.body;

	const newWorkout = new WorkoutModel({
		userId: req.user.id,
		name: name,
		duration: duration
	})

	return WorkoutModel.findOne({name: name})
	.then(workoutExist => {
		if(workoutExist){
			return res.status(409).send({message: "Workout name already exist"});
		}else{
			return newWorkout.save()
			.then(result => {
				res.status(201).send({message: 'Workout successfully added!' })
			})
			.catch(error => errorHandler(error, req, res))
		}

	})
	.catch(error => errorHandler(error, req, res))
}

module.exports.getMyWorkouts = (req,res) => {
 	// console.log(req.user);
	return WorkoutModel.find({userId: req.user.id})
	.then(result => {
		// console.log(result);
		if(result.length > 0){
		// console.log(user);
			return res.status(200).send(result);
		}
		
		return res.status(404).send({message: 'No found workouts'});
		
	})
	.catch(error => errorHandler(error,req,res));
}

module.exports.updateWorkout = (req, res) => {
	// console.log()
	const {name, duration} = req.body

	let updateWorkout = {
		
		name: name,
		duration: duration

	}

	return WorkoutModel.findByIdAndUpdate(req.params.id, updateWorkout)
	.then(workout => {
		// console.log(workout.params.id)
		if(workout){
			res.status(200).send({ success:true, message: 'Updated successfully'});
		}else {
			res.status(404).send({mesage:'Workout not found'})
		}
	})
	.catch(error => errorHandler(error, req, res))
}

module.exports.deleteWorkout = (req, res) => {
	return WorkoutModel.findByIdAndDelete(req.params.id)
	.then(workout => {
		// console.log(workout.params.id)
		if(workout){
			res.status(200).send({ success:true, message: 'Deleted successfully'});
		}else {
			res.status(404).send({mesage:'Workout not found'})
		}
	})
	.catch(error => errorHandler(error, req, res))
}

module.exports.completeWorkStatus = (req, res) => {
	
	// const {userId,}

	let updateStatus = {		
		status: "completed"
	}

	return WorkoutModel.findByIdAndUpdate(req.params.id, updateStatus)
	.then(workout => {
		console.log(workout)

		// if(workout.status === "completed"){
		// 	return res.status(404).send({message: 'Already updated'})
		// }

		if(!workout){
			return res.status(404).send({message: 'Workout not updated'})
		}

		return WorkoutModel.findById(req.params.id)
		.then(workout => {
			return res.status(200).send({message: 'Workout status updated successfully', workout})
		})
		
		
	})
	.catch(error => errorHandler(error, req, res))
}