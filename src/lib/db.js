import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Database connected ${con.connection.host}`);
  } catch (error) {
    console.log("Error connecting to database", error);
    process.exit(1); //exit with failure
  }
};
