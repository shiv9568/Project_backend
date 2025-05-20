import mongoose from 'mongoose';

const clubSchema = new mongoose.Schema({
    clubName: {
        type: String,
        required: true
    },
    uniId:{
        type:String,
        required:true,
    },
    clubDate: {
        type: Date,
        required: true,
        default:Date.now
    },
    clubDescription: { 
        type: String, 
        default: "Unity in Diversity" 
    },
    contactEmail: { 
        type: String, 
        required: true 
    },
    clubEventsCount: {
        type: Number,
        default: 0
    },
    clubLogo: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQj_g610laomkJdWey7TUHRDQgWkhg2KwHP_w&s"
    },
    lastUpdatedEvent: {
        type: Date,
        default: null,
    },
    events:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'events'
    }],
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'students'
    }],
    heads:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'students'
    }
});

const clubModel =(db)=> db.model('clubs', clubSchema);
export default clubModel;