import { Router } from "express";
import AuthorityConnection from '../middlewares/AuthorityConnection.js';
import SharedConnection from "../middlewares/SharedConnection.js";
import { getAllClubs, createClub, deleteClub,updateClub, getClub, getClubEvents} from "../controllers/clubController.js";
import { createEvent } from "../controllers/eventController.js";
const clubRoutes = Router();

clubRoutes.route('/')
    .post(AuthorityConnection, createClub)
    .get(SharedConnection, getAllClubs);

clubRoutes.route('/:clubId')
    .get(SharedConnection,getClub)
    .delete(AuthorityConnection,deleteClub)
    .put(AuthorityConnection,updateClub);

clubRoutes.route('/:clubId/events')
    .get(SharedConnection,getClubEvents)
    .post(AuthorityConnection,createEvent);


export default clubRoutes;