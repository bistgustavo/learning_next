import mongoose, { Mongoose } from "mongoose";

export async function connect() {
  try {
    mongoose.connect(process.env.MONGO_URI!);
    console.log(process.env.MONGO_URI!);

    const connection = mongoose.connection;

    connection.on("connected", () => {
      console.log("Database Connected !");
    });

    connection.on("error", () => {
      console.log("Mongodb connection failed check the uri !");
    });
  } catch (error) {
    console.log("Something went wrong!");
    console.log(error);
  }
}
