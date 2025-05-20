import mongoose from 'mongoose';
import eventModel from '../models/eventModel.js';
import clubModel from '../models/clubModel.js';
import StudentModel from '../models/studentModel.js';

export async function getAllEvents(req, res) {
    try {
        const db = req.db;
        const Event = eventModel(db);
        const Clubs = await clubModel(db);
        await db.model('clubs',Clubs.schema);
        const events = await Event.find().populate({
            path: 'club',
            select: 'clubName clubLogo contactEmail clubDescription',
        });
        console.log(events);
        if (events.length === 0) {
            return res.status(200).json({
                status: true,
                message: "No events present",
                data: [],
            });
        }
        res.status(200).json({
            status: true,
            message: "All events retrieved successfully",
            data: events,
        });
    } catch (error) {
        console.error("Error fetching events:", error.message);
        res.status(500).json({
            status: false,
            message: "Internal Server Error -> Unable to fetch events",
        });
    }
}

// Get event by ID
export async function getEventById(req, res) {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                status: false,
                message: "Event ID is required",
            });
        }
        const db = req.db;
        const Event = eventModel(db);
        const Club = clubModel(db);
        await db.model('clubs',Club.schema);
        const event = await Event.findById(id).populate('club');
        if (!event) {
            return res.status(404).json({
                status: false,
                message: "Event not found",
            });
        }

        res.status(200).json({
            status: true,
            message: "Event retrieved successfully",
            data: event,
        });
    } catch (error) {
        console.error("Error fetching event by ID:", error.message);
        res.status(500).json({
            status: false,
            message: "Internal Server Error -> Unable to fetch event",
        });
    }
}

export const createEvent = async (req, res) => {
    try {
        const {eventName, eventSpeaker, date, contactDetails, venue, description, time } = req.body;
        const uniId = req.uniId;
        const clubId = req.clubId;
        console.log("clubId is here ", clubId);
        console.log(req.body);
        if (!eventName || !eventSpeaker || !time || !date || !contactDetails || !venue || !description || !clubId) {
            return res.status(400).json({
                status: false,
                message: "All fields are required",
            });
        }
        console.log("reach here");
        const eventDate = new Date(date);
        if (isNaN(eventDate.getTime())) { 
            return res.status(400).json({
                status: false,
                message: "Invalid date format",
            });
        }

        if (!time) {
            return res.status(400).json({
                status: false,
                message: "Time is required",
            });
        }

        const db = mongoose.connection.useDb(uniId);
        const Event = eventModel(db);
        const Club = clubModel(db);

        const club = await Club.findById(clubId);
        if (!club) {
            return res.status(404).json({
                status: false,
                message: "Club not found",
            });
        }

        // Check if the event already exists
        const existingEvent = await Event.findOne({ eventName, date: eventDate, time, uniId, club: clubId });
        if (existingEvent) {
            return res.status(409).json({
                status: false,
                message: "Event already exists",
            });
        }

        // Create the new event
        const newEvent = new Event({
            eventPoster,
            eventName,
            eventSpeaker,
            date: eventDate,
            time,
            contactDetails,
            venue,
            description,
            uniId,
            club: clubId,
        });
        const savedEvent = await newEvent.save();
        club.events.push(savedEvent._id);
        await club.save();

        return res.status(201).json({
            status: true,
            message: "Event created successfully",
            data: savedEvent,
        });
    } catch (error) {
        console.error("Error creating event:", error);
        return res.status(500).json({
            status: false,
            message: "Internal Error -> createEvent",
            error: error.message,
        });
    }
};



export async function updateEvent(req, res) {
    try {
        const { id } = req.params;
        const { uniId, role, ...updateData } = req.body;

        if (role !== 'Head') {
            return res.status(403).json({
                status: false,
                message: "Only users with the role 'Head' can update events"
            });
        }

        if (!id) {
            return res.status(400).json({
                status: false,
                message: "Event ID is required",
            });
        }

        if (!uniId) {
            return res.status(400).json({
                status: false,
                message: "uniId is required",
            });
        }

        const db = mongoose.connection.useDb(uniId); // Use the uniId to select the correct database
        const Event = eventModel(db); // Get the Event model for the specific database

        const updatedEvent = await Event.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({
                status: false,
                message: "Event not found",
            });
        }

        res.status(200).json({
            status: true,
            message: "Event updated successfully",
            data: updatedEvent,
        });
    } catch (error) {
        console.error("Error updating event:", error.message);
        res.status(500).json({
            status: false,
            message: "Internal Server Error -> Unable to update event",
            error: error.message
        });
    }
}

export async function deleteEvent(req, res) {
    try {
        const { id } = req.params;
        const { uniId, role } = req.body;

        if (role !== 'Head') {
            return res.status(403).json({
                status: false,
                message: "Only users with the role 'Head' can delete events"
            });
        }

        if (!id) {
            return res.status(400).json({
                status: false,
                message: "Event ID is required",
            });
        }

        if (!uniId) {
            return res.status(400).json({
                status: false,
                message: "uniId is required",
            });
        }

        const db = mongoose.connection.useDb(uniId); // Use the uniId to select the correct database
        const Event = eventModel(db); // Get the Event model for the specific database

        const deletedEvent = await Event.findByIdAndDelete(id);
        if (!deletedEvent) {
            return res.status(404).json({
                status: false,
                message: "Event not found",
            });
        }

        res.status(200).json({
            status: true,
            message: "Event deleted successfully",
            data: deletedEvent,
        });
    } catch (error) {
        console.error("Error deleting event:", error.message);
        res.status(500).json({
            status: false,
            message: "Internal Server Error -> Unable to delete event",
            error: error.message
        });
    }
}


export const enrollStudent = async (req, res) => {
    try {
        const { eventId } = req.params;
        console.log("eventId is here ", eventId);
        const studentId = req.studentId;
        console.log("studentId is here ", studentId);
        const uniId = req.code;
        console.log("uniId is here ", uniId);

        if (!mongoose.Types.ObjectId.isValid(eventId) || !mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({
                status: false,
                message: "Invalid event ID or student ID"
            });
        }

        const db = mongoose.connection.useDb(uniId);
        const Event = eventModel(db);
        const Student = StudentModel(db);

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                status: false,
                message: "Event not found"
            });
        }

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({
                status: false,
                message: "Student not found"
            });
        }

        if (event.enrolledStudents.includes(studentId)) {
            return res.status(409).json({
                status: false,
                message: "Student is already enrolled in this event"
            });
        }

        event.enrolledStudents.push(studentId);
        student.events.push({ eventId: event._id, status: 'Enrolled' });

        await event.save();
        await student.save();

        return res.status(200).json({
            status: true,
            message: "Student enrolled successfully",
            data: { event, student }
        });
    } catch (error) {
        console.error("Error enrolling student:", error.message);
        return res.status(500).json({
            status: false,
            message: "Internal Error -> enrollStudent",
            error: error.message
        });
    }
};


export const checkEnrollment = async (req, res) => {
    try {
        const { eventId } = req.params;
        const studentId = req.studentId;
        const uniId = req.uniId;

        if (!mongoose.Types.ObjectId.isValid(eventId) || !mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({
                status: false,
                message: "Invalid event ID or student ID"
            });
        }

        const db = mongoose.connection.useDb(uniId);
        const Event = eventModel(db);

        // Find the event
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                status: false,
                message: "Event not found"
            });
        }

        // Check if the student is enrolled
        const isEnrolled = event.enrolledStudents.includes(studentId);

        return res.status(200).json({
            status: true,
            enrolled: isEnrolled,
            message: isEnrolled ? "Student is enrolled in this event" : "Student is not enrolled in this event"
        });
    } catch (error) {
        console.error("Error checking enrollment:", error.message);
        return res.status(500).json({
            status: false,
            message: "Internal Error -> checkEnrollment",
            error: error.message
        });
    }
};
