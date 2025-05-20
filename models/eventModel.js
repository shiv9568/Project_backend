import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    eventPoster: {
        type: String,
        required: [true, "Event poster is required"],
        default: "https://example.com/default-event-poster.png",
        validate: {
            validator: function (v) {
                return /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm.test(v);
            },
            message: props => `${props.value} is not a valid URL!`
        }
    },
    eventName: {
        type: String,
        required: [true, "Event name is required"],
        trim: true,
        minlength: [3, "Event name must be at least 3 characters"],
        maxlength: [100, "Event name cannot exceed 100 characters"]
    },
    eventSpeaker: {
        type: String,
        trim: true,
        maxlength: [100, "Speaker name cannot exceed 100 characters"]
    },
    date: {
        type: Date,
        required: [true, "Event date is required"],
        validate: {
            validator: function (v) {
                return v > new Date();
            },
            message: "Event date must be in the future"
        }
    },
    time: {
        type: String,
        match: [/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/, 'Please enter a valid time (HH:MM)'],
        required: [true, "Event time is required"]
    },
    contactDetails: {
        type: String,
        required: [true, "Contact details are required"],
        minlength: [10, "Contact details must be at least 10 characters"],
        maxlength: [200, "Contact details cannot exceed 200 characters"]
    },
    counterToRegister: {
        type: Number,
        default: 0,
        min: [0, "Counter must be at least 0"]
    },
    venue: {
        type: String,
        required: [true, "Event venue is required"],
        trim: true,
        maxlength: [200, "Venue name cannot exceed 200 characters"]
    },
    description: {
        type: String,
        required: [true, "Event description is required"],
        minlength: [10, "Description must be at least 10 characters"],
        maxlength: [1000, "Description cannot exceed 500 characters"]
    },
    uniId: {
        type: String,
        required: [true, "University ID is required"],
        trim: true,
        minlength: [3, "University ID must be at least 3 characters"]
    },
    club: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'clubs',
        required: [true, "Club ID is required"]
    },
    enrolledStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'students'
    }]
}, {
    timestamps: true
});

eventSchema.index({ date: 1, club: 1, uniId: 1 });

eventSchema.pre('save', function(next) {
    const eventDate = this.date;
    const eventTime = this.time;
    
    if (eventDate && eventTime) {
        const [hour, minute] = eventTime.split(':');
        const eventDateTime = new Date(eventDate);
        eventDateTime.setHours(hour, minute, 0, 0);

        if (eventDateTime < new Date()) {
            return next(new Error("Event time must be in the future"));
        }
    }
    next();
});

const eventModel = (db) => db.model('events', eventSchema);
export default eventModel;