import { Router } from "express";
import buildConnection from '../middlewares/buildConnection.js';
import Verify from "../controllers/verify.js";
import { Login, SignUp} from '../controllers/login.js';
const userRoutes = Router();

userRoutes.route('/login')
.post(buildConnection,Login);

userRoutes.route('/signup')
.post(buildConnection,SignUp);

userRoutes.route('/verify')
.get(Verify);

export default userRoutes;
