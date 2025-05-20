import Connection from "../Database/connection.js";

const buildConnection = async (req,res,next)=>{
    try{
        const {uniid} = req.headers;
        console.log(uniid);
        if(!uniid){
            return res.status(400).json({
                status:false,
                message:"University Code is not Available"
            });
        }
        const db = await Connection(process.env.Mongo_Username,process.env.Mongo_Password,uniid);
        req.db = db;
        req.uniId = uniid;
        next();
    } catch(error){
        console.log(error);
        return res.status(500).json({
            status:false,
            message:"Internal Error -> build Connection"
        })
    }
}

export default buildConnection;