import colors from "colors";
import { connect } from "mongoose";
import { exit } from "node:process";

export const connectDB = async () => {
  try {
    const { connection } = await connect(process.env.MONGOOSE_DB_PROD);
    const url = `${connection.host}:${connection.port}`;
    console.log(colors.cyan.bold(`Success connected to MongoDB ${url}`));
  } catch (error) {
    console.log(
      colors.red.bold("Error while connecting with MongoDB: " + error.message)
    );

    exit(1);
  }
};
