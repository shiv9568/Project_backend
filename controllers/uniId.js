import uniIdModel from "../models/universityId.js";
import Connection from "../Database/connection.js";

export const checkUniId = async (uniId)=>{
    try{
        console.log("step - 2");
        const connect = await Connection(process.env.Mongo_Username,process.env.Mongo_Password,"");
        const universityId = await uniIdModel(connect);
        const existUniId = await universityId({uniId});
        if(existUniId){
            return true;
        }
        return false;
    } catch(error){
        console.log(error.message);
        return false;
    }
}

export const addUniId= async (req,res,next)=>{
    // add university Code Validation

    const connect = await Connection(process.env.Mongo_Username,process.env.Mongo_Password,"");
    const universityId = await uniIdModel(connect);
    const existUniId = await universityId({uniId});
    console.log("This is university Id : ",existUniId);
    if(existUniId){
        return res.status(400).json({
            status:false,
            message:"This University Id already Exist"
        })
    }
    const newUniId = new universityId({uniId});
    await newUniId.save();
}

export default checkUniId;