import mongoose from "mongoose";
import colors from "colors";

export const DBConnect = async () => {
  const conn = await mongoose.connect(process.env.DB_URL);
  console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
};
