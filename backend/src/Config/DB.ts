import mongoose from 'mongoose';
export const ConnectDB = async () => {
    try {
        if (!process.env.MongoURL) {
            throw new Error("MongoURL is not defined in environment variables");
        }
        const connect = await mongoose.connect(process.env.MongoURL);
        console.log(`MogoDB Connected ${connect.connection.host}`);
    }
    catch (error) {
        console.log(`Error message : ${error}`);
        process.exit(1)
    }
} 