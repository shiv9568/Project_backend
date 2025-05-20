import mongoose from 'mongoose';

const authoritySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    uniId:{
        type:String,
        required:true,
    },
    password: {
        type: String,
        required: true,
        select:false,
        trim: true
    }
});

const authorityModel = (db)=> db.model('authority', authoritySchema);
export default authorityModel;