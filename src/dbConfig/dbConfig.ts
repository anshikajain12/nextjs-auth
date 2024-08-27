import mongoose from "mongoose";

export async function connect() {
    try {
        mongoose.connect(process.env.MONGO_URL!);
        const connection = mongoose.connection;
        connection.on("connected", () => {
            console.log("Mongo db connected");
        });

        connection.on("error", (error) => {
            console.log("MongoDB connection failed, please make sure db is up and running" + error);
            process.exit();
        });

    } catch (error) {
        console.log("Something went wrong in connect to db");
        console.log(error);
    }
}