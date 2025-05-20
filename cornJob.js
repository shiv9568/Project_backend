import cron from 'node-cron';
import mongoose from 'mongoose';
import eventModel from './models/eventModel';  // Adjust path accordingly
import clubModel from './models/clubModel';    // Adjust path accordingly

// Task to run every 24 hours
cron.schedule('0 0 * * *', async () => {  // '0 0 * * *' means run at midnight every day
    try {
        const uniCodes = ['uni1', 'uni2', 'uni3'];  // Add all your university codes here

        for (let uniCode of uniCodes) {
            // Connect to the specific university database using mongoose
            const db = mongoose.connection.useDb(uniCode);
            const Event = eventModel(db);
            const Club = clubModel(db);

            // Get current date and time
            const currentTime = new Date();
            const currentDate = currentTime.toISOString().split('T')[0];  // Get date part of current time
            const currentHour = currentTime.getHours();
            const currentMinute = currentTime.getMinutes();

            // Loop through all clubs
            const clubs = await Club.find({});
            for (let club of clubs) {
                const clubId = club._id;

                // Find the last event of the club (if exists) and check if the event count was already updated
                const lastEvent = await Event.findOne({
                    club: clubId,
                    date: { $lt: currentTime },  // Get events before the current date
                }).sort({ date: -1 });  // Sort by latest event

                if (lastEvent && (lastEvent.date > club.lastUpdatedEvent)) {
                    // Find all expired events that haven't been processed
                    const expiredEvents = await Event.find({
                        $or: [
                            { date: { $lt: currentTime } },  // Event passed already
                            {
                                date: currentTime,
                                time: { $lt: `${currentHour}:${currentMinute}` },  // Check time on same date
                            },
                        ],
                        club: clubId,
                    });

                    if (expiredEvents.length > 0) {
                        // Loop through all expired events and update the club's event count
                        for (let event of expiredEvents) {
                            // Increment the club's event count
                            club.clubEventsCount += 1;
                            await club.save();
                        }

                        // Update the last updated event timestamp in the club
                        club.lastUpdatedEvent = currentTime;
                        await club.save();
                    }
                }
            }
        }
    } catch (error) {
        console.error("Error during scheduled task:", error);
    }
});
