import { Router } from "express";
import {
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent
} from "../controllers/studentController.js";
import SharedConnection from "../middlewares/SharedConnection.js";
import clubHeadAccess from "../middlewares/clubHeadAccess.js";
import StudentConnection from "../middlewares/StudentConnection.js";

const studentRoutes = Router();

studentRoutes.route('/')
    .get(SharedConnection, getStudents);

studentRoutes.route('/:id')
    .get(StudentConnection, getStudentById)
    .put(StudentConnection, updateStudent)
    .delete(StudentConnection, deleteStudent);

export default studentRoutes;
