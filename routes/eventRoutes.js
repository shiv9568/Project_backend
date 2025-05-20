import { Router } from "express";

import { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent, enrollStudent, checkEnrollment} from "../controllers/eventController.js";
import SharedConnection from "../middlewares/SharedConnection.js";
import AuthorityConnection from "../middlewares/AuthorityConnection.js";
import clubHeadAccess from "../middlewares/clubHeadAccess.js";
import StudentConnection from "../middlewares/StudentConnection.js";
const eventRoutes = Router();

eventRoutes.route('/')
    .get(SharedConnection,getAllEvents)
    .post(clubHeadAccess,createEvent);

eventRoutes.route('/:id')
    .get(SharedConnection,getEventById)
    .put(clubHeadAccess,updateEvent)
    .delete(deleteEvent);

eventRoutes.route('/:eventId/enroll')
    .get(StudentConnection,checkEnrollment)
    .post(StudentConnection, enrollStudent);


export default eventRoutes;
