import jwt from 'jsonwebtoken';
import Connection from '../Database/connection.js';

const StudentConnection = async (req,res,next)=>{
    try{
        const token = req.headers.token;
        console.log("token is here",token);
        if(!token){
            return res.status(409).json({
                status:false,
                message:"Token or role is missing"
            })
        };
        const verify = jwt.verify(token,process.env.jwt_secret_student);
        if(!verify){
            return res.status(400).json({
                status:false,
                message:"Jwt not verified"
            })
        }
        const db = await Connection(process.env.Mongo_Username,process.env.Mongo_Password,verify.uniId);
        req.db = db;
        req.studentId = verify._id;
        next();
    } catch(error){
        console.log("Internal Error -> at verifying JWT");
        return res.status(500).json({
            status:false,
            message:"Error at Verifying JWT"
        })
    }
}

export default StudentConnection;