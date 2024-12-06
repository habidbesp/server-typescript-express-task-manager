import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { dirname } from "path";
import { env } from "process";
import { fileURLToPath } from "url";

// Check what env  we are in
// if we are in production always load the .env
// if we are in development (locally), load the .development.env

// console.log('import.meta.url', import.meta.url);
// console.log('fileURLToPath(import.meta.url)', fileURLToPath(import.meta.url));

const __dirname = dirname(fileURLToPath(import.meta.url));

// console.log('__DIRNAME', __dirname);

//  on PROD always load .env
if (process.env.NODE_ENV == "production") {
  dotenv.config(); // loading .env
} else {
  // if we are locally/development, look for .development.env
  let envPath = path.join(__dirname, ".development.env");
  // console.log(`OUR PATH TO THE ENV`, envPath);
  //  What if .development.env doesnt exist????
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  } else dotenv.config();
}

// Once env variables are loaded we have access to the process variables
// Create an object with all the secrets and share it with server.js
const config = {
  env: env.NODE_ENV || "development",
  frontendOrigin: env.FRONTEND_ORIGIN_DEV || env.FRONTEND_ORIGIN_PROD,
  secretKey: env.SECRET_KEY_DEV || env.SECRET_KEY_PROD,
  mongooseUrl: env.MONGOOSE_DB_DEV || env.MONGOOSE_DB_PROD,
  backendUrl: env.BACKEND_URL_DEV || env.BACKEND_URL_PROD,
};

// console.log("NODE_ENV", process.env);

console.log("***********************************************************");
console.log("OUR ENV SETUP ->", config.env);
console.log(config);

export default config;
