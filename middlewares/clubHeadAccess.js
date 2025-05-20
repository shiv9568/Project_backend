import jwt from 'jsonwebtoken';
import Connection from '../Database/connection.js';
import { promisify } from 'util';
import StudentModel from '../models/studentModel.js';

const clubHeadAccess = async (req, res, next) => {
    try {
        const { token, role } = req.headers;
        if (!token || !role) {
            return res.status(409).json({
                status: false,
                message: "Either token or role is missing"
            });
        }
        let secret;
        if (role === "Head") {
            secret = process.env.jwt_secret_head;
        } else if (role === "Student") {
            secret = process.env.jwt_secret_student;
        } else {
            return res.status(409).json({
                status: false,
                message: "Role is Invalid"
            });
        }

        const verify = await promisify(jwt.verify)(token, secret);
        if (!verify) {
            return res.status(400).json({
                status: false,
                message: "JWT not verified"
            });
        }
        const db = await Connection(process.env.Mongo_Username, process.env.Mongo_Password, verify.uniId);
        req.db = db;
        req.uniId = verify.uniId;
        if (role === "Student") {
            const Student = await StudentModel(db);
            const student = await Student.findOne({ email: verify.email });

            if (!student) {
                return res.status(404).json({
                    status: false,
                    message: "Student not found"
                });
            }
            const headClub = student.clubs.find(club => club.clubPost === "Head");
            console.log(headClub,"and student is ",student);
            if (headClub) {
                req.clubId = headClub.clubId;
                console.log("head club ",headClub);
            }
        }
        next();

    } catch (error) {
        console.log("Error:", error);
        return res.status(409).json({
            status: false,
            message: "Clubs Head Access is Denied"
        });
    }
};

export default clubHeadAccess;
