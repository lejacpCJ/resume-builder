import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", ()=>{
            console.log("Database connected successfully")
        })

        let mongodbURI = process.env.MONGO_URI;
        const projectName = 'resume-builder';

        if(!mongodbURI) {
            throw new Error("MONGO_URI is not set correctly")
        }

        if(mongodbURI.endsWith('/')) {
            mongodbURI = mongodbURI.slice(0, -1)
        }

        await mongoose.connect(`${mongodbURI}/${projectName}`);
    } catch (error) {
        console.error("Error connecting to Mongo DB:", error);
        
    }
}

export default connectDB;