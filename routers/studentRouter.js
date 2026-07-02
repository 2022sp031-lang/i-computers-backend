import express from 'express';
import Student from '../models/student.js';
import { createStudent, getStudents } from '../controllers/studentController.js';

const studentRouter = express.Router();

studentRouter.get('/', getStudents)

studentRouter.put('/', ()=> {
    console.log("PUT Request received!");
})

studentRouter.post('/', createStudent)

studentRouter.delete('/', ()=> {
    console.log("DELETE Request received!");
})

export default studentRouter;