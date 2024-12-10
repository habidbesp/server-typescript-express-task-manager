import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
  origin: function (origin, callback) {
    const whitelist = [process.env.FRONTEND_ORIGIN_PROD];
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS error: No access for this origin"));
    }
  },
};
