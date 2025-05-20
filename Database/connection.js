import mongoose from "mongoose";

const connections = {};

const Connection = async (username, password, uniId) => {
    console.log(`Attempting to connect to database ${uniId}`);
    if (connections[uniId]) {
        console.log(`Reusing existing connection for ${uniId}`);
        return connections[uniId];
    }
    try {
        const connect = await mongoose.connect(`mongodb://localhost:27017/${uniId}`, {
            serverSelectionTimeoutMS: 30000,
        });
        console.log(`Connected to Database ${uniId}`);
        connections[uniId] = connect;
        return connect;
    } catch (error) {
        console.log(`Error in Connection to Database ${uniId}:`, error.message);
        throw new Error(error.message);
    }
};

export default Connection;