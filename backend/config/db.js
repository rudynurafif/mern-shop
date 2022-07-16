// connection file

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, { // connect to database from Mongo URI (.env)
      useUnifiedTopology: true, // set up vision
      useNewUrlParser: true
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(`Error: ${error.message}`.red.underline.bold);
    process.exit(1) // exit with failure
  }
}

export default connectDB