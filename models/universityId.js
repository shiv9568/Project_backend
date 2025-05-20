import mongoose from "mongoose"
const uniIdSchema = mongoose.Schema({
    uniId:{
        type:String,
        required:true,
    }
})

const uniIdModel = (db)=> db.model('uniid',uniIdSchema);
export default uniIdModel;