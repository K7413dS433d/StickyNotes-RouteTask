import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose
    .connect(process.env.CONNECTION_URI)
    .then(() => console.log("db Connected successfully"))
    .catch((error) => console.log(error.message));
};

export default connectDB;
