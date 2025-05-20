import jwt from 'jsonwebtoken';
import { promisify } from 'util';

const Verify = async (req,res)=>{
    try{
        const {token,role} = req.headers;
        if(!token || !role ){
            return res.status(409).json({
                status:false,
                message:"Either token or role is missing"
            })
        }
        let secret;
        if(role==='Student'){
            secret = process.env.jwt_secret_student;
        } else if(role==='Head'){
            secret = process.env.jwt_secret_head;
        } else{
            return req.status(409).json({
                status:false,
                message:"Role is Invalid"
            })
        }
        const verify = await promisify(jwt.verify)(token, secret);
        if (!verify) {
            return res.status(401).json({
                status: false,
                message: "JWT not verified",
            });
        }
        return res.status(200).json({
            status: true,
            data: verify,
        });
    } catch(error){
        console.log(error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(409).json({
                status: false,
                message: "JWT not verified",
            });
        }
        return res.status(500).json({
            status: false,
            message: "Internal Error -> Verify User",
        });
    }
}
export default Verify;