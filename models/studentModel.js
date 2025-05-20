import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
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
    password: {
        type: String,
        required: true,
        select: false
    },
    image: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOHrsKrgHXGVJWG9QGOJW3uAIcYvUieNdEXw&s"
    },
    address: {
        type: String,
        trim: true
    },
    dateOfBirth: {
        type: Date,
    },
    roll: {
        type: String,
        required: true
    },
    graduationYear: {
        type: Number,
        min: 2020,
        max: 2099,
        required:true
    },
    phone: {
        type: String,
        required: true
    },
    university:{
        type:String,
        required:true
    },
    universityEmail: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    eventCount: {
        type: Number,
        default: 0
    },
    branch: {
        type: String,
        required: true,
        enum: ["CSE", "MBA", "BA", "B.Tech", "M.Tech", "MCA", "B.Com", "M.Com", "BBA", "LLB", "LLM", "BE", "ME", "BSc", "MSc"]
    },
    uniId:{
        type:String,
        required:true,
    },
    country:{
        type:String,
        required:true,
        default:"India"
    },
    clubs: [{
        clubId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'clubs'
        },
        clubPost:{
            type:String,
            enum:["Head","Member"]
        }
    }],
    events:[{
        eventId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'events'
        },
        status:{
            type:String,
            required:true,
            enum:['Enrolled','Participated']
        }
    }]
});

const StudentModel = (db)=> db.model('students', studentSchema);
export default StudentModel;