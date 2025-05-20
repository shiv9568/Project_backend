import clubModel from "../models/clubModel.js";
import StudentModel from "../models/studentModel.js";
import eventModel from "../models/eventModel.js";
import mongoose  from "mongoose";

export const createClub = async (req, res) => {
    try {
        const { clubName, clubLogo, headEmail, contactEmail, clubDescription } = req.body;
        const uniId = req.uniId;

        if (!clubName || !clubLogo || !contactEmail || !headEmail || !clubDescription) {
            return res.status(400).json({
                status: false,
                message: "Something is missing"
            });
        }

        const db = req.db;
        const Student = await StudentModel(db);
        const Club = await clubModel(db);

        const student = await Student.findOne({ email: headEmail });
        if (!student) {
            return res.status(400).json({
                status: false,
                message: "Wrong Student Email for head"
            });
        }
        console.log(student);

        const findClub = await Club.findOne({ clubName });
        if (findClub) {
            return res.status(400).json({
                status: true,
                message: "Club with this name is already created"
            });
        }

        const newClub = new Club({
            clubName,
            uniId,
            contactEmail,
            clubDescription,
            clubLogo: clubLogo || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQj_g610laomkJdWey7TUHRDQgWkhg2KwHP_w&s"
        });

        newClub.heads = student._id;

        const savedClub = await newClub.save();
        student.clubs.push({
            clubId: savedClub._id,
            clubPost: "Head"
        });

        await student.save();

        return res.status(200).json({
            status: true,
            message: "Club created successfully and student added as head",
            data: savedClub,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: "Internal Error -> Club Creation"
        });
    }
};



export const getAllClubs = async (req, res) => {
    try {
        const db = req.db;
        
        const Clubs = await clubModel(db);
        console.log(Clubs);
        const allClubs = await Clubs.find({}, 'clubName clubDescription contactEmail clubLogo');
        return res.status(200).json({
            status: true,
            message: "All Clubs are retrieved",
            data: allClubs
        })
    } catch (error) {
        console.log("hello", error.message);
        return res.status(500).json({
            status: false,
            message: "Internal Error -> Getting All Clubs"
        })
    }
}



export const deleteClub = async (req, res) => {
    try {
        const { clubId } = req.params;
        const uniId = req.uniId;

        console.log(`clubId: ${clubId}, uniId: ${uniId}`);

        if (!clubId) {
            return res.status(400).json({
                status: false,
                message: "Club ID is required",
            });
        }

        const db = req.db;
        const Clubs = await clubModel(db);
        const club = await Clubs.findById(clubId);
        if (!club) {
            return res.status(404).json({
                status: false,
                message: "Club not found",
            });
        }
        await club.deleteOne();
        return res.status(200).json({
            status: true,
            message: "Club deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting club:", error.message);
        return res.status(500).json({
            status: false,
            message: "Internal Error -> Club Deletion",
            error: error.message
        });
    }
};

export const getClub = async (req, res) => {
    try {
        const { clubId } = req.params;
        if (!clubId) {
            return res.status(400).json({
                status: false,
                message: "Club ID is required",
            });
        }
        const db = req.db;
        const Clubs = await clubModel(db);
        const Student = await StudentModel(db);
        const Event = await eventModel(db);
        await db.model('students',Student.schema);
        await db.model('events',Event.schema);
        const club = await Clubs.findById(clubId).populate('heads').populate('events');
        club.headEmail = club.heads.email;
        if (!club) {
            return res.status(404).json({
                status: false,
                message: "Club not found",
            });
        }
        return res.status(200).json({
            status: true,
            data:club
        });
    } catch (error) {
        console.error("Error deleting club:", error.message);
        return res.status(500).json({
            status: false,
            message: "Internal Error -> Club Deletion",
            error: error.message
        });
    }
};
export const getClubEvents = async (req, res) => {
    try {
        const { clubId } = req.params;
        const db = req.db;
        const Event = await eventModel(db);
        const Club = await clubModel(db);
        await db.model('clubs',Club.schema);
        const events = await Event.find({ club: clubId }).populate({
            path: 'club',
            select: 'clubName clubLogo contactEmail clubDescription',
        });
        if (!events.length) {
            return res.status(404).json({
                status: false,
                message: "No events found for the given club ID",
            });
        }
        return res.status(200).json({
            status: true,
            message: "Events for the club fetched successfully",
            data: events,
        });
    } catch (error) {
        console.error("Error fetching club events:", error);
        return res.status(500).json({
            status: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};



export const updateClub = async (req, res) => {
    try {
        const { clubId } = req.params;
        const updatedData = req.body; 
        console.log(updatedData);
        if (!clubId) {
            return res.status(400).json({
                status: false,
                message: "Club ID is required to update the club",
            });
        }
        const db = req.db; 
        const Club = clubModel(db);
        const updatedClub = await Club.findByIdAndUpdate(
            clubId,
            updatedData,
            { new: true, runValidators: true }
        );

        if (!updatedClub) {
            return res.status(404).json({
                status: false,
                message: "No club found with the provided ID",
            });
        }

        return res.status(200).json({
            status: true,
            message: "Club updated successfully",
            data: updatedClub,
        });
    } catch (error) {
        console.error("Error updating club:", error);
        return res.status(500).json({
            status: false,
            message: "Internal Error -> Club Update",
            error: error.message,
        });
    }
};
