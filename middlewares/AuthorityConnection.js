import jwt from 'jsonwebtoken';
import Connection from '../Database/connection.js';
import { promisify } from 'util';


const AuthorityConnection = async (req,res,next)=>{
    try{
        const {token,role} = req.headers;
        if(!token || !role){
            return res.status(409).json({
                status:true,
                message:"Either token or role is missing"
            })
        }
        let secret;
        if(role==="Head"){
            secret = process.env.jwt_secret_head;
        } else{
            return res.status(401).json({
                status:false,
                message:"Role is Invalid"
            })
        }
        const verify = await promisify(jwt.verify)(token, secret);
        if (!verify) {
            return res.status(401).json({
                status: false,
                message: "JWT not6 verified",
            });
        }
        const db = await Connection(process.env.Mongo_Username,process.env.Mongo_Password,verify.uniId);
        req.db = db;
        req.uniId = verify.uniId;
        next();
    } catch(error){
        console.log(error);
        return res.status(500).json({
            status:false,
            message:"Error at Verifying JWT"
        })
    }
}
export default AuthorityConnection;