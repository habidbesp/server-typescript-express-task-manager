import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    const whitelist = [process.env.FRONTEND_ORIGIN_PROD];

    if (process.argv[2] === "--api") {
      whitelist.push(undefined);
    }

    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS error: No access for this origin"));
    }
  },
};
